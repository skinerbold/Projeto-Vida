'use client'

import { motion } from 'framer-motion'
import { Download, Share2, ChevronLeft, Calendar, Target, CheckCircle, Clock, Package } from 'lucide-react'
import { VisionData, GeneratedGoals, GoalDetail } from '../../lib/types'

interface ReportStepProps {
  visionData: VisionData
  generatedGoals: GeneratedGoals | null
  onPrev: () => void
}

export default function ReportStep({ visionData, generatedGoals, onPrev }: ReportStepProps) {
  const downloadReport = () => {
    const reportContent = generateReportContent()
    const blob = new Blob([reportContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `projeto-de-vida-${visionData.name.toLowerCase().replace(/\s+/g, '-')}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareReport = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meu Projeto de Vida Personalizado',
          text: `Confira meu projeto de vida personalizado criado com IA!`,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Erro ao compartilhar:', err)
      }
    } else {
      // Fallback: copiar URL para clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copiado para a área de transferência!')
    }
  }

  const generateReportContent = () => {
    const currentDate = new Date().toLocaleDateString('pt-BR')
    
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Projeto de Vida - ${visionData.name}</title>
        <style>
            body { font-family: 'Segoe UI', sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #d35d3a; text-align: center; border-bottom: 3px solid #d35d3a; padding-bottom: 10px; }
            h2 { color: #c4472f; margin-top: 30px; }
            .section { margin-bottom: 25px; padding: 15px; background: #faf7f2; border-left: 4px solid #d35d3a; }
            .goals { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }
            .goal-card { background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .year { font-weight: bold; color: #d35d3a; }
            .footer { text-align: center; margin-top: 40px; color: #666; font-size: 0.9em; }
        </style>
    </head>
    <body>
        <h1>Projeto de Vida Personalizado</h1>
        <p style="text-align: center; font-size: 1.1em;"><strong>${visionData.name}</strong> - ${currentDate}</p>
        
        <div class="section">
            <h2>🎯 Suas Visões para 2030</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;">
                <div><strong>Físico:</strong> ${visionData.physical}</div>
                <div><strong>Mental:</strong> ${visionData.mental}</div>
                <div><strong>Social:</strong> ${visionData.social}</div>
                <div><strong>Emocional:</strong> ${visionData.emotional}</div>
                <div><strong>Espiritual:</strong> ${visionData.spiritual}</div>
                <div><strong>Caráter:</strong> ${visionData.character}</div>
            </div>
        </div>

        <div class="section">
            <h2>📅 Plano Detalhado de Metas</h2>
            ${Object.entries(generatedGoals || {}).map(([category, goals]) => `
                <div class="category-section">
                    <h3 style="color: #d35d3a; margin-bottom: 20px;">${getCategoryTitle(category)}</h3>
                    ${goals.map((goalDetail: GoalDetail, index: number) => `
                        <div class="goal-detail" style="margin-bottom: 30px; padding: 20px; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                            <h4 style="color: #c4472f; margin-bottom: 15px; font-size: 1.1em;">
                                Ano ${index + 1}: ${goalDetail.goal}
                            </h4>
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                                <div>
                                    <h5 style="color: #16a34a; margin-bottom: 10px; display: flex; align-items: center;">
                                        ✓ Ações Necessárias
                                    </h5>
                                    <ul style="margin: 0; padding-left: 20px;">
                                        ${goalDetail.actions.map((action: string) => `<li style="margin-bottom: 5px;">${action}</li>`).join('')}
                                    </ul>
                                </div>
                                
                                <div>
                                    <h5 style="color: #2563eb; margin-bottom: 10px; display: flex; align-items: center;">
                                        ⏰ Cronograma
                                    </h5>
                                    <p style="background: #eff6ff; padding: 10px; border-radius: 6px; margin: 0;">
                                        ${goalDetail.timeline}
                                    </p>
                                </div>
                                
                                <div>
                                    <h5 style="color: #ea580c; margin-bottom: 10px; display: flex; align-items: center;">
                                        📦 Recursos Necessários
                                    </h5>
                                    <ul style="margin: 0; padding-left: 20px;">
                                        ${goalDetail.resources.map((resource: string) => `<li style="margin-bottom: 5px;">${resource}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `).join('')}
        </div>

        <div class="footer">
            <p>Produzido por @SkinerBold, inspirado pela Aninha</p>
            <p>Projeto de Vida Personalizado com IA - ${currentDate}</p>
        </div>
    </body>
    </html>
    `
  }

  const getCategoryTitle = (key: string) => {
    const titles: Record<string, string> = {
      physical: 'Físico',
      mental: 'Mental',
      social: 'Social',
      emotional: 'Emocional',
      spiritual: 'Espiritual',
      character: 'Caráter'
    }
    return titles[key] || key
  }

  const resetProject = () => {
    if (confirm('Tem certeza que deseja começar um novo projeto? Todos os dados serão perdidos.')) {
      localStorage.removeItem('projeto-de-vida-data')
      window.location.reload()
    }
  }

  if (!generatedGoals) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="card">
          <p>Carregando relatório...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mb-6">
          <Target className="w-10 h-10 text-white" />
        </div>
        <h2 className="section-title">
          Parabéns, {visionData.name}! 🎉
        </h2>
        <p className="text-gray-600 text-lg">
          Seu projeto de vida personalizado está pronto! Agora você tem um roadmap claro para alcançar seus objetivos.
        </p>
      </motion.div>

      {/* Report Content */}
      <div className="space-y-8">
        {/* Vision Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-primary-600" />
            Suas Visões para 2030
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div>
                <strong className="text-primary-600">Físico:</strong>
                <p className="text-gray-700 mt-1">{visionData.physical}</p>
              </div>
              <div>
                <strong className="text-primary-600">Mental:</strong>
                <p className="text-gray-700 mt-1">{visionData.mental}</p>
              </div>
              <div>
                <strong className="text-primary-600">Social:</strong>
                <p className="text-gray-700 mt-1">{visionData.social}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <strong className="text-primary-600">Emocional:</strong>
                <p className="text-gray-700 mt-1">{visionData.emotional}</p>
              </div>
              <div>
                <strong className="text-primary-600">Espiritual:</strong>
                <p className="text-gray-700 mt-1">{visionData.spiritual}</p>
              </div>
              <div>
                <strong className="text-primary-600">Caráter:</strong>
                <p className="text-gray-700 mt-1">{visionData.character}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Goals Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Target className="w-5 h-5 mr-2 text-primary-600" />
            Plano de Metas Anuais
          </h3>
          
          <div className="space-y-6">
            {Object.entries(generatedGoals).map(([category, goals], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (index * 0.1) }}
                className="border-l-4 border-primary-200 pl-6"
              >
                <h4 className="font-medium text-gray-800 mb-4 capitalize text-lg">
                  {getCategoryTitle(category)}
                </h4>
                <div className="space-y-4">
                  {goals.map((goalDetail: GoalDetail, goalIndex: number) => (
                    <div key={goalIndex} className="bg-gray-50 rounded-lg p-4">
                      <div className="font-medium text-primary-600 mb-3 flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        Ano {goalIndex + 1}: {goalDetail.goal}
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <h5 className="font-medium text-green-700 mb-2 flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Ações
                          </h5>
                          <ul className="space-y-1 text-gray-600">
                            {goalDetail.actions.map((action, actionIndex) => (
                              <li key={actionIndex} className="flex items-start">
                                <span className="w-1 h-1 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-blue-700 mb-2 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            Cronograma
                          </h5>
                          <p className="text-gray-600 bg-blue-50 p-2 rounded text-xs">
                            {goalDetail.timeline}
                          </p>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-orange-700 mb-2 flex items-center">
                            <Package className="w-3 h-3 mr-1" />
                            Recursos
                          </h5>
                          <ul className="space-y-1 text-gray-600">
                            {goalDetail.resources.map((resource, resourceIndex) => (
                              <li key={resourceIndex} className="flex items-start">
                                <span className="w-1 h-1 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {resource}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <button
            onClick={downloadReport}
            className="btn-primary flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Baixar Relatório
          </button>
          
          <button
            onClick={shareReport}
            className="btn-secondary flex items-center"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </button>
          
          <button
            onClick={resetProject}
            className="btn-secondary text-gray-600 hover:text-gray-800"
          >
            Novo Projeto
          </button>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex justify-start pt-6"
        >
          <button
            onClick={onPrev}
            className="btn-secondary flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar às metas
          </button>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="card bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-center"
        >
          <p className="text-green-800">
            🌟 <strong>Projeto salvo automaticamente!</strong> Seus dados estão seguros no seu navegador.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
