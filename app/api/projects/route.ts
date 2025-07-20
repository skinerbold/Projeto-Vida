import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const project = await prisma.lifeProject.findFirst({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' }
    })

    if (!project) {
      return NextResponse.json({ project: null })
    }

    const projectData = {
      id: project.id,
      visionData: {
        name: project.name,
        physical: project.physical,
        mental: project.mental,
        social: project.social,
        emotional: project.emotional,
        spiritual: project.spiritual,
        character: project.character,
      },
      generatedGoals: project.generatedGoals ? JSON.parse(project.generatedGoals) : null,
      currentStep: project.currentStep,
      completed: project.completed,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }

    return NextResponse.json({ project: projectData })
  } catch (error) {
    console.error('Erro ao carregar projeto:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { visionData, generatedGoals, currentStep, completed } = body

    const projectData = {
      userId: session.user.id,
      name: visionData.name,
      physical: visionData.physical,
      mental: visionData.mental,
      social: visionData.social,
      emotional: visionData.emotional,
      spiritual: visionData.spiritual,
      character: visionData.character,
      generatedGoals: generatedGoals ? JSON.stringify(generatedGoals) : '{}',
      currentStep: currentStep || 0,
      completed: completed || false,
    }

    const existingProject = await prisma.lifeProject.findFirst({
      where: { userId: session.user.id }
    })

    let project
    if (existingProject) {
      project = await prisma.lifeProject.update({
        where: { id: existingProject.id },
        data: projectData
      })
    } else {
      project = await prisma.lifeProject.create({
        data: projectData
      })
    }

    return NextResponse.json({ 
      success: true, 
      project: {
        id: project.id,
        updatedAt: project.updatedAt
      }
    })
  } catch (error) {
    console.error('Erro ao salvar projeto:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
