import { GoogleGenerativeAI } from '@google/generative-ai'
import { VisionData, GeneratedGoals, GoalDetail } from '../../lib/types'

const API_KEY = 'AIzaSyDbXpYwyGL3jWFeuYiRb8Hjlji2FpuLvUQ'

if (!API_KEY) {
  throw new Error('API Key do Gemini não encontrada')
}

const genAI = new GoogleGenerativeAI(API_KEY)
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash',
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
  }
})

// Cache simples para evitar regenerar metas idênticas
const cache = new Map<string, GeneratedGoals>()

export async function generateGoals(visionData: VisionData, feedback: string = ''): Promise<GeneratedGoals> {
  // Criar chave de cache baseada nos dados
  const cacheKey = JSON.stringify({ visionData, feedback })
  
  // Verificar cache primeiro
  if (cache.has(cacheKey) && !feedback) {
    return cache.get(cacheKey)!
  }

  try {
    const prompt = `Crie metas anuais (5 anos) para ${visionData.name} baseadas em suas visões:

VISÕES 2030:
- Físico: ${visionData.physical}
- Mental: ${visionData.mental}  
- Social: ${visionData.social}
- Emocional: ${visionData.emotional}
- Espiritual: ${visionData.spiritual}
- Caráter: ${visionData.character}

${feedback ? `AJUSTES: ${feedback}` : ''}

RESPONDA APENAS COM JSON:
{
  "physical": [
    {"goal": "Meta ano 1", "actions": ["ação1", "ação2", "ação3"], "timeline": "12 meses", "resources": ["recurso1", "recurso2"]},
    {"goal": "Meta ano 2", "actions": [...], "timeline": "...", "resources": [...]},
    ...5 metas total
  ],
  "mental": [...5 metas],
  "social": [...5 metas], 
  "emotional": [...5 metas],
  "spiritual": [...5 metas],
  "character": [...5 metas]
}

Metas progressivas, específicas e práticas.`

    // Criar promise com timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout: A IA demorou muito para responder')), 30000)
    )

    const generatePromise = model.generateContent(prompt)
    
    const result = await Promise.race([generatePromise, timeoutPromise]) as any
    const response = await result.response
    const text = response.text()

    // Limpar a resposta e extrair apenas o JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Resposta da IA não está no formato esperado')
    }

    const goals = JSON.parse(jsonMatch[0])
    
    // Validação rápida
    const requiredKeys = ['physical', 'mental', 'social', 'emotional', 'spiritual', 'character']
    for (const key of requiredKeys) {
      if (!goals[key] || !Array.isArray(goals[key])) {
        throw new Error(`Estrutura inválida na categoria: ${key}`)
      }
    }

    // Salvar no cache se não for regeneração
    if (!feedback) {
      cache.set(cacheKey, goals)
    }

    return goals as GeneratedGoals

  } catch (error) {
    console.error('Erro ao gerar metas:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Erro de autenticação com a API. Verifique a chave da API.')
      } else if (error.message.includes('quota')) {
        throw new Error('Limite de uso da API atingido. Tente novamente mais tarde.')
      } else if (error.message.includes('network')) {
        throw new Error('Erro de conexão. Verifique sua internet e tente novamente.')
      } else {
        throw new Error(`Erro ao processar sua solicitação: ${error.message}`)
      }
    }
    
    throw new Error('Erro inesperado ao gerar metas. Tente novamente.')
  }
}
