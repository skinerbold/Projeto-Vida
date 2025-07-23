'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { AnimatePresence, motion } from 'framer-motion'
import { User, Compass, Target, Award } from 'lucide-react'

import { useProjectData } from './hooks/useProjectData'
import { VisionData, GeneratedGoals } from '../lib/types'

import WelcomeStep from './components/WelcomeStep'
import VisionStep from './components/VisionStep'
import GoalsGeneration from './components/GoalsGeneration'
import ReportStep from './components/ReportStep'
import LoadingAnimation from './components/LoadingAnimation'
import Header from './components/Header'


export default function Home() {
  const { data: session } = useSession()
  const { projectData, saveProject, isAuthenticated } = useProjectData()
  
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

  // Carregar dados do projeto quando disponível
  useEffect(() => {
    if (projectData) {
      // Só atualizar se os dados do projeto são mais recentes
      if (projectData.visionData && projectData.visionData.name) {
        setVisionData(projectData.visionData)
      }
      if (projectData.generatedGoals) {
        setGeneratedGoals(projectData.generatedGoals)
      }
      if (projectData.currentStep !== undefined) {
        setCurrentStep(projectData.currentStep)
      }
    }
  }, [projectData])

  // Auto-save quando os dados mudarem (para usuários autenticados)
  useEffect(() => {
    if (isAuthenticated && (visionData.name || generatedGoals)) {
      const autoSave = async () => {
        await saveProject({
          visionData,
          generatedGoals,
          currentStep,
          completed: currentStep === 3
        })
      }
      
      // Debounce auto-save
      const timeoutId = setTimeout(autoSave, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [visionData, generatedGoals, currentStep, isAuthenticated, saveProject])

  // Fallback para localStorage se não estiver autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      const savedData = localStorage.getItem('projeto-de-vida-data')
      if (savedData) {
        const parsed = JSON.parse(savedData)
        setVisionData(parsed.visionData || visionData)
        setGeneratedGoals(parsed.generatedGoals || null)
        setCurrentStep(parsed.currentStep || 0)
      }
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) {
      const dataToSave = {
        visionData,
        generatedGoals,
        currentStep
      }
      localStorage.setItem('projeto-de-vida-data', JSON.stringify(dataToSave))
    }
  }, [visionData, generatedGoals, currentStep, isAuthenticated])

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
      <Header />
      
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
