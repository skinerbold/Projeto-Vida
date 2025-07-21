'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { VisionData, GeneratedGoals } from '../../lib/types'

export interface ProjectData {
  id?: string
  visionData: VisionData
  generatedGoals: GeneratedGoals | null
  currentStep: number
  completed: boolean
  createdAt?: Date
  updatedAt?: Date
}

export function useProjectData() {
  const { data: session, status } = useSession()
  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Carregar dados quando o usuário faz login
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      loadProject()
    } else if (status === 'unauthenticated') {
      // Tentar carregar dados do localStorage se não estiver logado
      loadFromLocalStorage()
    }
  }, [session, status])

  const loadProject = async () => {
    if (!session?.user?.id) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/projects')
      const data = await response.json()

      if (response.ok) {
        setProjectData(data.project)
      } else {
        setError(data.error || 'Erro ao carregar projeto')
      }
    } catch (err) {
      console.error('Erro ao carregar projeto:', err)
      setError('Erro de conexão')
    } finally {
      setIsLoading(false)
    }
  }

  const saveProject = async (data: Partial<ProjectData>) => {
    setError(null)

    // Se não estiver logado, salvar no localStorage
    if (!session?.user?.id) {
      const localData = {
        visionData: data.visionData || { name: '', physical: '', mental: '', social: '', emotional: '', spiritual: '', character: '' },
        generatedGoals: data.generatedGoals || null,
        currentStep: data.currentStep || 0,
        completed: data.completed || false,
      }
      localStorage.setItem('projeto-de-vida-data', JSON.stringify(localData))
      setProjectData(prev => ({ ...prev, ...localData } as ProjectData))
      return { success: true }
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        // Recarregar dados após salvar
        await loadProject()
        return { success: true }
      } else {
        setError(result.error || 'Erro ao salvar projeto')
        return { success: false, error: result.error }
      }
    } catch (err) {
      console.error('Erro ao salvar projeto:', err)
      setError('Erro de conexão')
      return { success: false, error: 'Erro de conexão' }
    } finally {
      setIsLoading(false)
    }
  }

  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem('projeto-de-vida-data')
      if (savedData) {
        const parsed = JSON.parse(savedData)
        setProjectData({
          visionData: parsed.visionData || { name: '', physical: '', mental: '', social: '', emotional: '', spiritual: '', character: '' },
          generatedGoals: parsed.generatedGoals || null,
          currentStep: parsed.currentStep || 0,
          completed: parsed.completed || false,
        })
      }
    } catch (err) {
      console.error('Erro ao carregar do localStorage:', err)
    }
  }

  const clearProject = () => {
    setProjectData(null)
    localStorage.removeItem('projeto-de-vida-data')
  }

  return {
    projectData,
    isLoading,
    error,
    saveProject,
    loadProject,
    clearProject,
    isAuthenticated: status === 'authenticated',
  }
}
