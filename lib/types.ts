export interface VisionData {
  name: string
  physical: string
  mental: string
  social: string
  emotional: string
  spiritual: string
  character: string
}

export interface GoalDetail {
  goal: string
  actions: string[]
  timeline: string
  resources: string[]
}

export interface GeneratedGoals {
  physical: GoalDetail[]
  mental: GoalDetail[]
  social: GoalDetail[]
  emotional: GoalDetail[]
  spiritual: GoalDetail[]
  character: GoalDetail[]
}

export interface ProjectData {
  visionData: VisionData
  generatedGoals: GeneratedGoals | null
  currentStep: number
  completed: boolean
}
