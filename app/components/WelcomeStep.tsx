'use client'

import { motion } from 'framer-motion'
import { User, Sparkles } from 'lucide-react'
import { VisionData } from '../page'

interface WelcomeStepProps {
  visionData: VisionData
  setVisionData: (data: VisionData) => void
  onNext: () => void
}

export default function WelcomeStep({ visionData, setVisionData, onNext }: WelcomeStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (visionData.name.trim()) {
      onNext()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="card text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full mb-8 mx-auto"
        >
          <Sparkles className="w-10 h-10 text-white" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="section-title text-center"
        >
          Bem-vindo ao seu futuro!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 text-lg mb-8 leading-relaxed"
        >
          Vamos criar juntos um projeto de vida personalizado que transformará suas visões em metas concretas e alcançáveis. 
          Com o poder da inteligência artificial, você terá um roadmap claro para os próximos 5 anos.
        </motion.p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label htmlFor="name" className="block text-left font-medium text-gray-700 mb-2">
              <User className="inline w-5 h-5 mr-2" />
              Como devemos te chamar?
            </label>
            <input
              id="name"
              type="text"
              value={visionData.name}
              onChange={(e) => setVisionData({ ...visionData, name: e.target.value })}
              className="input-field text-lg"
              placeholder="Digite seu nome..."
              required
              autoFocus
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="pt-4"
          >
            <button
              type="submit"
              disabled={!visionData.name.trim()}
              className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Vamos começar sua jornada
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
          transition={{ delay: 0.7 }}
          className="mt-8 p-4 bg-primary-50 rounded-xl border border-primary-100"
        >
          <p className="text-sm text-primary-700">
            💡 <strong>Dica:</strong> Seja sincero e específico nas próximas etapas. 
            Quanto mais detalhadas forem suas visões, mais personalizadas serão suas metas!
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
