'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, RefreshCw, ChevronLeft, AlertCircle } from 'lucide-react'
import { VisionData, GeneratedGoals } from '../page'
import { generateGoals } from '../lib/gemini'

interface GoalsGenerationProps {
  visionData: VisionData
  generatedGoals: GeneratedGoals | null
  setGeneratedGoals: (goals: GeneratedGoals | null) => void
  setIsLoading: (loading: boolean) => void
  onNext: () => void
  onPrev: () => void
}

export default function GoalsGeneration({ 
  visionData, 
  generatedGoals, 
  setGeneratedGoals, 
  setIsLoading,
  onNext, 
  onPrev 
}: GoalsGenerationProps) {
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState('')
  const [isRegenerating, setIsRegenerating] = useState(false)

  const handleGenerateGoals = async (regenerate = false, userFeedback = '') => {
    try {
      setError(null)
      setIsLoading(true)
      if (regenerate) setIsRegenerating(true)

      const goals = await generateGoals(visionData, userFeedback)
      setGeneratedGoals(goals)
    } catch (err: any) {
      console.error('Erro ao gerar metas:', err)
      setError(err.message || 'Erro ao gerar metas. Tente novamente.')
    } finally {
      setIsLoading(false)
      setIsRegenerating(false)
    }
  }

  const handleRegenerateGoals = async () => {
    await handleGenerateGoals(true, feedback)
    setFeedback('')
  }

  // Auto-generate goals on first load
  useState(() => {
    if (!generatedGoals && !error) {
      handleGenerateGoals()
    }
  })

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="card text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Ops! Algo deu errado
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button onClick={onPrev} className="btn-secondary">
              Voltar
            </button>
            <button 
              onClick={() => handleGenerateGoals()} 
              className="btn-primary"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  if (!generatedGoals) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="card">
          <Sparkles className="w-16 h-16 text-primary-500 mx-auto mb-4 animate-pulse-soft" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Gerando suas metas personalizadas...
          </h2>
          <p className="text-gray-600">
            Nossa IA está analisando suas visões e criando um plano personalizado para você.
            Isso pode levar alguns segundos.
          </p>
        </div>
      </motion.div>
    )
  }

  const categories = [
    { key: 'physical', title: 'Físico', color: 'from-red-400 to-pink-400' },
    { key: 'mental', title: 'Mental', color: 'from-blue-400 to-indigo-400' },
    { key: 'social', title: 'Social', color: 'from-green-400 to-emerald-400' },
    { key: 'emotional', title: 'Emocional', color: 'from-pink-400 to-rose-400' },
    { key: 'spiritual', title: 'Espiritual', color: 'from-purple-400 to-violet-400' },
    { key: 'character', title: 'Caráter', color: 'from-amber-400 to-orange-400' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="card">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="section-title">
            Suas Metas Personalizadas 🎯
          </h2>
          <p className="text-gray-600">
            Baseadas nas suas visões, aqui estão as metas anuais que te levarão aos seus objetivos em 5 anos.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="space-y-3"
            >
              <div className="flex items-center font-medium text-gray-700 mb-3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mr-3`}>
                  <span className="text-white text-sm font-bold">
                    {category.title.charAt(0)}
                  </span>
                </div>
                {category.title}
              </div>
              <div className="space-y-2">
                {generatedGoals[category.key as keyof GeneratedGoals]?.map((goal: string, goalIndex: number) => (
                  <motion.div
                    key={goalIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (goalIndex * 0.1) }}
                    className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm"
                  >
                    <span className="font-medium text-primary-600">
                      Ano {goalIndex + 1}:
                    </span>{' '}
                    {goal}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Regenerate Goals Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="border-t pt-6 space-y-4"
        >
          <h3 className="font-semibold text-gray-800">
            Não gostou de alguma meta?
          </h3>
          <p className="text-sm text-gray-600">
            Descreva o que você gostaria de mudar e nossa IA gerará novas sugestões.
          </p>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Ex: As metas físicas estão muito focadas em academia, prefiro atividades ao ar livre..."
            className="input-field h-20 resize-none w-full"
          />
          <button
            onClick={handleRegenerateGoals}
            disabled={isRegenerating || !feedback.trim()}
            className="btn-secondary flex items-center disabled:opacity-50"
          >
            {isRegenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Regenerando...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Sugerir novas metas
              </>
            )}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex gap-4 pt-6"
        >
          <button
            onClick={onPrev}
            className="btn-secondary flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar
          </button>
          
          <button
            onClick={onNext}
            className="btn-primary flex-1"
          >
            Gerar meu relatório final
            <motion.div
              className="inline-block ml-2"
              whileHover={{ x: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              →
            </motion.div>
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}
