import {
  GradingInputState,
  LevelConfig,
  MondaiConfig,
  ScoreResult,
  SectionScoreResult,
} from "@/features/jlpt-grading/types"

const round2 = (value: number) => Math.round(value * 100) / 100

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

const getQuestionCountRange = (questionCount: number) => ({
  min: Math.max(1, questionCount - 1),
  max: questionCount + 1,
})

export function createInitialInputs(levelConfig: LevelConfig): GradingInputState {
  return levelConfig.mondai.reduce<GradingInputState>((acc, mondai) => {
    acc[mondai.id] = {
      correctCount: 0,
      questionCount: mondai.questionCount,
      weight: mondai.defaultWeight,
    }
    return acc
  }, {})
}

function getSafeInput(mondai: MondaiConfig, inputs: GradingInputState) {
  const input = inputs[mondai.id]

  if (!input) {
    return {
      correctCount: 0,
      questionCount: mondai.questionCount,
      weight: mondai.defaultWeight,
    }
  }

  const questionCountRange = getQuestionCountRange(mondai.questionCount)
  const safeQuestionCount = clamp(input.questionCount || mondai.questionCount, questionCountRange.min, questionCountRange.max)

  return {
    questionCount: safeQuestionCount,
    correctCount: clamp(input.correctCount || 0, 0, safeQuestionCount),
    weight: clamp(input.weight || mondai.defaultWeight, 0.1, 10),
  }
}

export function calculateEstimatedScore(levelConfig: LevelConfig, inputs: GradingInputState): ScoreResult {
  const mondaiResults = levelConfig.mondai.map((mondai) => {
    const input = getSafeInput(mondai, inputs)
    const weightedEarned = input.correctCount * input.weight
    const weightedMax = input.questionCount * input.weight

    return {
      mondaiId: mondai.id,
      weightedEarned,
      weightedMax,
    }
  })

  const sectionResults = levelConfig.sections.map<SectionScoreResult>((section) => {
    const sectionMondaiIds = levelConfig.mondai
      .filter((mondai) => mondai.sectionId === section.id)
      .map((mondai) => mondai.id)

    const rawWeightedEarned = mondaiResults
      .filter((result) => sectionMondaiIds.includes(result.mondaiId))
      .reduce((sum, result) => sum + result.weightedEarned, 0)

    const rawWeightedMax = mondaiResults
      .filter((result) => sectionMondaiIds.includes(result.mondaiId))
      .reduce((sum, result) => sum + result.weightedMax, 0)

    const normalizedScore =
      rawWeightedMax === 0 ? 0 : (rawWeightedEarned / rawWeightedMax) * section.maxScore

    return {
      sectionId: section.id,
      title: section.title,
      rawWeightedEarned: round2(rawWeightedEarned),
      rawWeightedMax: round2(rawWeightedMax),
      normalizedScore: round2(normalizedScore),
      maxScore: section.maxScore,
    }
  })

  const totalEstimatedScore = round2(
    sectionResults.reduce((sum, section) => sum + section.normalizedScore, 0)
  )

  const sectionFailures = levelConfig.sectionMinimums
    .map((rule) => {
      const sectionResult = sectionResults.find((section) => section.sectionId === rule.sectionId)
      if (!sectionResult) {
        return null
      }

      if (sectionResult.normalizedScore < rule.minScore) {
        return {
          sectionId: rule.sectionId,
          currentScore: sectionResult.normalizedScore,
          minScore: rule.minScore,
        }
      }

      return null
    })
    .filter((item): item is { sectionId: SectionScoreResult["sectionId"]; currentScore: number; minScore: number } => Boolean(item))

  const pass = totalEstimatedScore >= levelConfig.totalPassScore && sectionFailures.length === 0

  return {
    sectionResults,
    mondaiResults,
    totalEstimatedScore,
    totalMaxScore: levelConfig.totalMaxScore,
    totalPassScore: levelConfig.totalPassScore,
    sectionFailures,
    pass,
  }
}
