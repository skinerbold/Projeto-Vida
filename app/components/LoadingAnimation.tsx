'use client'

import { motion } from 'framer-motion'
import { Sparkles, Brain } from 'lucide-react'

export default function LoadingAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto text-center"
    >
      <div className="card">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mb-6 mx-auto"
        >
          <Brain className="w-10 h-10 text-white" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-semibold text-gray-800 mb-4"
        >
          IA trabalhando em suas metas...
        </motion.h2>

        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="space-y-2 mb-6"
        >
          <p className="text-gray-600">Analisando suas visões...</p>
          <p className="text-gray-600">Criando metas personalizadas...</p>
          <p className="text-gray-600">Organizando o plano de 5 anos...</p>
        </motion.div>

        {/* Loading dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -10, 0] }}
              transition={{ 
                duration: 0.6, 
                repeat: Infinity, 
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="w-3 h-3 bg-primary-500 rounded-full"
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 p-4 bg-primary-50 rounded-xl border border-primary-100"
        >
          <Sparkles className="w-5 h-5 text-primary-600 mx-auto mb-2" />
          <p className="text-sm text-primary-700">
            Nossa IA está processando suas informações para criar o melhor plano possível para você!
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
