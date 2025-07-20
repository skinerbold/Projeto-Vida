'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Sparkles, Target, User, Heart, Brain, Users, Compass, Shield, Award } from 'lucide-react'
import WelcomeStep from './components/WelcomeStep'
import VisionStep from './components/VisionStep'
import GoalsGeneration from './components/GoalsGeneration'
import ReportStep from './components/ReportStep'
import LoadingAnimation from './components/LoadingAnimation'

export type VisionData = {
  name: string
  physical: string
  mental: string
  social: string
  emotional: string
  spiritual: string
  character: string
}

export type GoalDetail = {
  goal: string
  actions: string[]
  timeline: string
  resources: string[]
}

export type GeneratedGoals = {
  physical: GoalDetail[]
  mental: GoalDetail[]
  social: GoalDetail[]
  emotional: GoalDetail[]
  spiritual: GoalDetail[]
  character: GoalDetail[]
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0)
  const [visionData, setVisionData] = useState<VisionData>({
    name: '',
    physical: '',
    mental: '',
    social: '',
    emotional: '',
    spiritual: '',
    character: ''
  })
  const [generatedGoals, setGeneratedGoals] = useState<GeneratedGoals | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Auto-save no localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('projeto-de-vida-data')
    if (savedData) {
      const parsed = JSON.parse(savedData)
      setVisionData(parsed.visionData || visionData)
      setGeneratedGoals(parsed.generatedGoals || null)
      setCurrentStep(parsed.currentStep || 0)
    }
  }, [])

  useEffect(() => {
    const dataToSave = {
      visionData,
      generatedGoals,
      currentStep
    }
    localStorage.setItem('projeto-de-vida-data', JSON.stringify(dataToSave))
  }, [visionData, generatedGoals, currentStep])

  const steps = [
    { title: 'Bem-vindo', icon: User },
    { title: 'Sua Visão', icon: Compass },
    { title: 'Gerando Metas', icon: Target },
    { title: 'Seu Projeto', icon: Award }
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-cream via-primary-50 to-secondary-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-main-bg bg-cover bg-center bg-no-repeat opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-primary-100/30" />
      
      {/* Header */}
      <header className="relative z-10 pt-8 pb-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold gradient-text mb-2">
              Projeto de Vida Personalizado
            </h1>
            <p className="text-gray-600 text-lg">
              Transforme suas visões em metas concretas com o poder da IA
            </p>
          </motion.div>

          {/* Progress Bar */}
          <div className="mt-12 mb-8">
            <div className="flex justify-between items-center mb-4">
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={index} className="flex flex-col items-center">
                    <motion.div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                        index <= currentStep
                          ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                      whileHover={index <= currentStep ? { scale: 1.1 } : {}}
                    >
                      <Icon size={20} />
                    </motion.div>
                    <span className={`text-sm font-medium ${
                      index <= currentStep ? 'text-primary-600' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingAnimation key="loading" />
            ) : (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && (
                  <WelcomeStep
                    visionData={visionData}
                    setVisionData={setVisionData}
                    onNext={nextStep}
                  />
                )}
                {currentStep === 1 && (
                  <VisionStep
                    visionData={visionData}
                    setVisionData={setVisionData}
                    onNext={nextStep}
                    onPrev={prevStep}
                  />
                )}
                {currentStep === 2 && (
                  <GoalsGeneration
                    visionData={visionData}
                    generatedGoals={generatedGoals}
                    setGeneratedGoals={setGeneratedGoals}
                    setIsLoading={setIsLoading}
                    onNext={nextStep}
                    onPrev={prevStep}
                  />
                )}
                {currentStep === 3 && (
                  <ReportStep
                    visionData={visionData}
                    generatedGoals={generatedGoals}
                    onPrev={prevStep}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-gray-500 text-sm">
        <p>Produzido por @SkinerBold, inspirado pela Aninha</p>
      </footer>
    </div>
  )
}
