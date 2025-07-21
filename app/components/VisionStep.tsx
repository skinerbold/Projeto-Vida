'use client'

import { motion } from 'framer-motion'
import { Heart, Brain, Users, Compass, Shield, Award, ChevronLeft } from 'lucide-react'
import { VisionData } from '../../lib/types'

interface VisionStepProps {
  visionData: VisionData
  setVisionData: (data: VisionData) => void
  onNext: () => void
  onPrev: () => void
}

const visionCategories = [
  {
    key: 'physical' as keyof VisionData,
    title: 'Físico',
    icon: Award,
    placeholder: 'Como você se vê fisicamente? Saúde, forma física, energia...',
    color: 'from-red-400 to-pink-400'
  },
  {
    key: 'mental' as keyof VisionData,
    title: 'Mental',
    icon: Brain,
    placeholder: 'Que conhecimentos, habilidades mentais e intelectuais você quer desenvolver?',
    color: 'from-blue-400 to-indigo-400'
  },
  {
    key: 'social' as keyof VisionData,
    title: 'Social',
    icon: Users,
    placeholder: 'Como serão seus relacionamentos? Networking, amizades, família...',
    color: 'from-green-400 to-emerald-400'
  },
  {
    key: 'emotional' as keyof VisionData,
    title: 'Emocional',
    icon: Heart,
    placeholder: 'Como você quer estar emocionalmente? Equilíbrio, felicidade, paz...',
    color: 'from-pink-400 to-rose-400'
  },
  {
    key: 'spiritual' as keyof VisionData,
    title: 'Espiritual',
    icon: Compass,
    placeholder: 'Qual será sua conexão espiritual? Propósito, valores, crescimento pessoal...',
    color: 'from-purple-400 to-violet-400'
  },
  {
    key: 'character' as keyof VisionData,
    title: 'Caráter',
    icon: Shield,
    placeholder: 'Que tipo de pessoa você quer ser? Valores, princípios, virtudes...',
    color: 'from-amber-400 to-orange-400'
  }
]

export default function VisionStep({ visionData, setVisionData, onNext, onPrev }: VisionStepProps) {
  const isComplete = visionCategories.every(category => 
    visionData[category.key] && visionData[category.key].trim().length > 0
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isComplete) {
      onNext()
    }
  }

  const updateVision = (key: keyof VisionData, value: string) => {
    setVisionData({ ...visionData, [key]: value })
  }

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
            Olá, {visionData.name}! ✨
          </h2>
          <p className="text-gray-600 text-lg">
            Agora vamos definir sua visão para os próximos 5 anos. 
            Imagine-se em 2030 e descreva como você se vê em cada área da sua vida.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {visionCategories.map((category, index) => {
              const Icon = category.icon
              return (
                <motion.div
                  key={category.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="space-y-3"
                >
                  <label className="flex items-center font-medium text-gray-700">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mr-3`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    {category.title}
                  </label>
                  <textarea
                    value={visionData[category.key]}
                    onChange={(e) => updateVision(category.key, e.target.value)}
                    placeholder={category.placeholder}
                    className="input-field h-24 resize-none"
                    required
                  />
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex gap-4 pt-6"
          >
            <button
              type="button"
              onClick={onPrev}
              className="btn-secondary flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Voltar
            </button>
            
            <button
              type="submit"
              disabled={!isComplete}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Gerar metas com IA
              <motion.div
                className="inline-block ml-2"
                whileHover={{ x: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                →
              </motion.div>
            </button>
          </motion.div>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 p-4 bg-secondary-50 rounded-xl border border-secondary-100"
        >
          <p className="text-sm text-secondary-700">
            🎯 <strong>Lembre-se:</strong> Seja específico e realista. 
            Suas visões serão a base para gerar metas anuais personalizadas que te levarão até lá!
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
