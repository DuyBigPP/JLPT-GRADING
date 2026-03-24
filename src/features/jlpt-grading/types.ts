export type JlptLevel = "N1" | "N2" | "N3" | "N4" | "N5"

export type MondaiCategory =
  | "kanji"
  | "vocabulary"
  | "grammar"
  | "reading"
  | "listening"

export type ScoreSectionId =
  | "language"
  | "reading"
  | "language_reading"
  | "listening"

export type SectionMinRule = {
  sectionId: ScoreSectionId
  minScore: number
  maxScore: number
}

export type WeightRange = {
  min: number
  max: number
}

export type MondaiConfig = {
  id: string
  code: string
  title: string
  questionCount: number
  category: MondaiCategory
  sectionId: ScoreSectionId
  defaultWeight: number
  recommendedRange: WeightRange
}

export type ScoreSectionConfig = {
  id: ScoreSectionId
  title: string
  maxScore: number
}

export type LevelConfig = {
  level: JlptLevel
  title: string
  totalPassScore: number
  totalMaxScore: number
  sections: ScoreSectionConfig[]
  sectionMinimums: SectionMinRule[]
  mondai: MondaiConfig[]
}

export type MondaiInput = {
  correctCount: number
  weight: number
}

export type GradingInputState = Record<string, MondaiInput>

export type MondaiScoreResult = {
  mondaiId: string
  weightedEarned: number
  weightedMax: number
}

export type SectionScoreResult = {
  sectionId: ScoreSectionId
  title: string
  rawWeightedEarned: number
  rawWeightedMax: number
  normalizedScore: number
  maxScore: number
}

export type ScoreResult = {
  sectionResults: SectionScoreResult[]
  mondaiResults: MondaiScoreResult[]
  totalEstimatedScore: number
  totalMaxScore: number
  totalPassScore: number
  sectionFailures: Array<{ sectionId: ScoreSectionId; currentScore: number; minScore: number }>
  pass: boolean
}
