import { GoogleGenerativeAI } from '@google/generative-ai'
import { VisionData, GeneratedGoals, GoalDetail } from '../page'

const API_KEY = 'AIzaSyDbXpYwyGL3jWFeuYiRb8Hjlji2FpuLvUQ'

if (!API_KEY) {
  throw new Error('API Key do Gemini não encontrada')
}

const genAI = new GoogleGenerativeAI(API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export async function generateGoals(visionData: VisionData, feedback: string = ''): Promise<GeneratedGoals> {
  try {
    const prompt = `
Você é um expert em planejamento de vida e desenvolvimento pessoal. Com base nas visões de 5 anos fornecidas pelo usuário, crie um plano detalhado com metas anuais, ações específicas, prazos e recursos necessários para cada categoria.

INFORMAÇÕES DO USUÁRIO:
Nome: ${visionData.name}

VISÕES PARA 2030:
- Físico: ${visionData.physical}
- Mental: ${visionData.mental}  
- Social: ${visionData.social}
- Emocional: ${visionData.emotional}
- Espiritual: ${visionData.spiritual}
- Caráter: ${visionData.character}

${feedback ? `FEEDBACK DO USUÁRIO: ${feedback}` : ''}

INSTRUÇÕES:
1. Para cada categoria, crie exatamente 5 metas (uma para cada ano)
2. Para cada meta, forneça:
   - GOAL: A meta específica e mensurável
   - ACTIONS: 3-5 ações concretas para alcançar a meta
   - TIMELINE: Prazo específico e marcos intermediários
   - RESOURCES: Recursos necessários (tempo, dinheiro, ferramentas, pessoas, etc.)
3. As metas devem ser progressivas e construir uma sobre a outra
4. Use linguagem motivacional e prática
5. Seja específico com prazos, valores e quantidades
6. As ações devem ser práticas e realizáveis

FORMATO DE RESPOSTA (JSON):
{
  "physical": [
    {
      "goal": "Meta específica do ano 1",
      "actions": ["Ação 1", "Ação 2", "Ação 3", "Ação 4"],
      "timeline": "Prazo específico com marcos",
      "resources": ["Recurso 1", "Recurso 2", "Recurso 3"]
    }
  ],
  "mental": [...],
  "social": [...],
  "emotional": [...],
  "spiritual": [...],
  "character": [...]
}

EXEMPLO PARA REFERÊNCIA:
{
  "goal": "Perder 10kg e atingir 15% de gordura corporal",
  "actions": [
    "Treinar 4x por semana na academia",
    "Seguir dieta de 1800 calorias",
    "Caminhar 10.000 passos diários",
    "Fazer exames médicos trimestrais"
  ],
  "timeline": "12 meses | Marcos: -3kg (3 meses), -6kg (6 meses), -10kg (12 meses)",
  "resources": [
    "Academia: R$ 80/mês",
    "Nutricionista: R$ 150/consulta",
    "App de contagem calórica",
    "Smartwatch para monitoramento"
  ]
}

Responda APENAS com o JSON válido, sem explicações adicionais.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Limpar a resposta e extrair apenas o JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Resposta da IA não está no formato esperado')
    }

    const goals = JSON.parse(jsonMatch[0])
    
    // Validar estrutura da resposta
    const requiredKeys = ['physical', 'mental', 'social', 'emotional', 'spiritual', 'character']
    for (const key of requiredKeys) {
      if (!goals[key] || !Array.isArray(goals[key]) || goals[key].length !== 5) {
        throw new Error(`Estrutura inválida na resposta da IA para a categoria: ${key}`)
      }
      
      // Validar estrutura de cada meta
      for (const goalDetail of goals[key]) {
        if (!goalDetail.goal || !goalDetail.actions || !goalDetail.timeline || !goalDetail.resources) {
          throw new Error(`Meta incompleta na categoria ${key}. Faltam campos obrigatórios.`)
        }
        if (!Array.isArray(goalDetail.actions) || !Array.isArray(goalDetail.resources)) {
          throw new Error(`Formato inválido na categoria ${key}. Actions e resources devem ser arrays.`)
        }
      }
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
