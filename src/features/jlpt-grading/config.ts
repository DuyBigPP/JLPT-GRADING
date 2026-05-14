import { LevelConfig, MondaiCategory, WeightRange } from "@/features/jlpt-grading/types"

const RANGE = {
  kanji: { min: 1, max: 1.2 },
  vocabulary: { min: 1.5, max: 2 },
  grammar: { min: 1.5, max: 2 },
  reading: { min: 2, max: 5 },
  listening: { min: 2, max: 5 },
} satisfies Record<MondaiCategory, WeightRange>

const weightByCategory: Record<MondaiCategory, number> = {
  kanji: 1.1,
  vocabulary: 1.7,
  grammar: 1.9,
  reading: 3,
  listening: 2.8,
}

type MondaiSeed = {
  code: string
  titleKey: string
  questionCount: number
  category: MondaiCategory
}

type SectionSeed = {
  sectionId: "language" | "reading" | "language_reading" | "listening"
  sectionTitleKey: string
  mondai: MondaiSeed[]
}

function createMondai(level: string, sectionId: SectionSeed["sectionId"], seed: MondaiSeed) {
  return {
    id: `${level}-${sectionId}-${seed.code}`,
    code: seed.code,
    titleKey: seed.titleKey,
    questionCount: seed.questionCount,
    category: seed.category,
    sectionId,
    defaultWeight: weightByCategory[seed.category],
    recommendedRange: RANGE[seed.category],
  }
}

function createLevelConfig(
  level: LevelConfig["level"],
  title: string,
  totalPassScore: number,
  sections: LevelConfig["sections"],
  sectionMinimums: LevelConfig["sectionMinimums"],
  sectionSeeds: SectionSeed[]
): LevelConfig {
  const mondai = sectionSeeds.flatMap((section) =>
    section.mondai.map((m) => createMondai(level, section.sectionId, m))
  )

  return {
    level,
    title,
    totalPassScore,
    totalMaxScore: 180,
    sections,
    sectionMinimums,
    mondai,
  }
}

export const jlptConfigs: Record<LevelConfig["level"], LevelConfig> = {
  N1: createLevelConfig(
    "N1",
    "JLPT N1",
    100,
    [
      { id: "language", titleKey: "config.sections.language", maxScore: 60 },
      { id: "reading", titleKey: "config.sections.reading", maxScore: 60 },
      { id: "listening", titleKey: "config.sections.listening", maxScore: 60 },
    ],
    [
      { sectionId: "language", minScore: 19, maxScore: 60 },
      { sectionId: "reading", minScore: 19, maxScore: 60 },
      { sectionId: "listening", minScore: 19, maxScore: 60 },
    ],
    [
      {
        sectionId: "language",
        sectionTitleKey: "config.sections.language",
        mondai: [
          { code: "M1", titleKey: "config.mondai.kanjiReading", questionCount: 6, category: "kanji" },
          { code: "M2", titleKey: "config.mondai.context", questionCount: 7, category: "vocabulary" },
          { code: "M3", titleKey: "config.mondai.similarWords", questionCount: 6, category: "vocabulary" },
          { code: "M4", titleKey: "config.mondai.wordUsage", questionCount: 6, category: "vocabulary" },
          { code: "M5", titleKey: "config.mondai.grammarSentence", questionCount: 10, category: "grammar" },
          { code: "M6", titleKey: "config.mondai.sentenceArrangement", questionCount: 5, category: "grammar" },
          { code: "M7", titleKey: "config.mondai.grammarParagraph", questionCount: 4, category: "grammar" },
        ],
      },
      {
        sectionId: "reading",
        sectionTitleKey: "config.sections.reading",
        mondai: [
          { code: "M8", titleKey: "config.mondai.shortPassage", questionCount: 4, category: "reading" },
          { code: "M9", titleKey: "config.mondai.mediumPassage", questionCount: 9, category: "reading" },
          { code: "M10", titleKey: "config.mondai.longPassage", questionCount: 3, category: "reading" },
          { code: "M11", titleKey: "config.mondai.comprehensiveReading", questionCount: 2, category: "reading" },
          { code: "M12", titleKey: "config.mondai.longTopic", questionCount: 3, category: "reading" },
          { code: "M13", titleKey: "config.mondai.informationSearch", questionCount: 2, category: "reading" },
        ],
      },
      {
        sectionId: "listening",
        sectionTitleKey: "config.sections.listening",
        mondai: [
          { code: "M1", titleKey: "config.mondai.taskUnderstanding", questionCount: 5, category: "listening" },
          { code: "M2", titleKey: "config.mondai.mainPoint", questionCount: 6, category: "listening" },
          { code: "M3", titleKey: "config.mondai.generalUnderstanding", questionCount: 5, category: "listening" },
          { code: "M4", titleKey: "config.mondai.quickResponse", questionCount: 11, category: "listening" },
          { code: "M5", titleKey: "config.mondai.comprehensiveListening", questionCount: 3, category: "listening" },
        ],
      },
    ]
  ),
  N2: createLevelConfig(
    "N2",
    "JLPT N2",
    90,
    [
      { id: "language", titleKey: "config.sections.language", maxScore: 60 },
      { id: "reading", titleKey: "config.sections.reading", maxScore: 60 },
      { id: "listening", titleKey: "config.sections.listening", maxScore: 60 },
    ],
    [
      { sectionId: "language", minScore: 19, maxScore: 60 },
      { sectionId: "reading", minScore: 19, maxScore: 60 },
      { sectionId: "listening", minScore: 19, maxScore: 60 },
    ],
    [
      {
        sectionId: "language",
        sectionTitleKey: "config.sections.language",
        mondai: [
          { code: "M1", titleKey: "config.mondai.kanjiReading", questionCount: 5, category: "kanji" },
          { code: "M2", titleKey: "config.mondai.kanjiWriting", questionCount: 5, category: "kanji" },
          { code: "M3", titleKey: "config.mondai.wordFormation", questionCount: 3, category: "vocabulary" },
          { code: "M4", titleKey: "config.mondai.context", questionCount: 7, category: "vocabulary" },
          { code: "M5", titleKey: "config.mondai.similarWords", questionCount: 5, category: "vocabulary" },
          { code: "M6", titleKey: "config.mondai.wordUsage", questionCount: 5, category: "vocabulary" },
          { code: "M7", titleKey: "config.mondai.grammarSentence", questionCount: 12, category: "grammar" },
          { code: "M8", titleKey: "config.mondai.sentenceArrangement", questionCount: 5, category: "grammar" },
          { code: "M9", titleKey: "config.mondai.grammarParagraph", questionCount: 4, category: "grammar" },
        ],
      },
      {
        sectionId: "reading",
        sectionTitleKey: "config.sections.reading",
        mondai: [
          { code: "M10", titleKey: "config.mondai.shortPassage", questionCount: 5, category: "reading" },
          { code: "M11", titleKey: "config.mondai.mediumPassage", questionCount: 9, category: "reading" },
          { code: "M12", titleKey: "config.mondai.comprehensiveReading", questionCount: 2, category: "reading" },
          { code: "M13", titleKey: "config.mondai.longTopic", questionCount: 3, category: "reading" },
          { code: "M14", titleKey: "config.mondai.informationSearch", questionCount: 2, category: "reading" },
        ],
      },
      {
        sectionId: "listening",
        sectionTitleKey: "config.sections.listening",
        mondai: [
          { code: "M1", titleKey: "config.mondai.taskUnderstanding", questionCount: 5, category: "listening" },
          { code: "M2", titleKey: "config.mondai.mainPoint", questionCount: 6, category: "listening" },
          { code: "M3", titleKey: "config.mondai.generalUnderstanding", questionCount: 5, category: "listening" },
          { code: "M4", titleKey: "config.mondai.quickResponse", questionCount: 11, category: "listening" },
          { code: "M5", titleKey: "config.mondai.comprehensiveListening", questionCount: 4, category: "listening" },
        ],
      },
    ]
  ),
  N3: createLevelConfig(
    "N3",
    "JLPT N3",
    95,
    [
      { id: "language", titleKey: "config.sections.vocabulary", maxScore: 60 },
      { id: "reading", titleKey: "config.sections.grammarReading", maxScore: 60 },
      { id: "listening", titleKey: "config.sections.listening", maxScore: 60 },
    ],
    [
      { sectionId: "language", minScore: 19, maxScore: 60 },
      { sectionId: "reading", minScore: 19, maxScore: 60 },
      { sectionId: "listening", minScore: 19, maxScore: 60 },
    ],
    [
      {
        sectionId: "language",
        sectionTitleKey: "config.sections.vocabulary",
        mondai: [
          { code: "M1", titleKey: "config.mondai.kanjiReading", questionCount: 8, category: "kanji" },
          { code: "M2", titleKey: "config.mondai.kanjiWriting", questionCount: 6, category: "kanji" },
          { code: "M3", titleKey: "config.mondai.context", questionCount: 11, category: "vocabulary" },
          { code: "M4", titleKey: "config.mondai.similarWords", questionCount: 5, category: "vocabulary" },
          { code: "M5", titleKey: "config.mondai.wordUsage", questionCount: 5, category: "vocabulary" },
        ],
      },
      {
        sectionId: "reading",
        sectionTitleKey: "config.sections.grammarReading",
        mondai: [
          { code: "M1", titleKey: "config.mondai.grammarSentence", questionCount: 13, category: "grammar" },
          { code: "M2", titleKey: "config.mondai.sentenceArrangement", questionCount: 5, category: "grammar" },
          { code: "M3", titleKey: "config.mondai.grammarParagraph", questionCount: 4, category: "grammar" },
          { code: "M4", titleKey: "config.mondai.shortPassage", questionCount: 4, category: "reading" },
          { code: "M5", titleKey: "config.mondai.mediumPassage", questionCount: 6, category: "reading" },
          { code: "M6", titleKey: "config.mondai.longPassage", questionCount: 4, category: "reading" },
          { code: "M7", titleKey: "config.mondai.informationSearch", questionCount: 2, category: "reading" },
        ],
      },
      {
        sectionId: "listening",
        sectionTitleKey: "config.sections.listening",
        mondai: [
          { code: "M1", titleKey: "config.mondai.taskUnderstanding", questionCount: 6, category: "listening" },
          { code: "M2", titleKey: "config.mondai.mainPoint", questionCount: 6, category: "listening" },
          { code: "M3", titleKey: "config.mondai.generalUnderstanding", questionCount: 3, category: "listening" },
          { code: "M4", titleKey: "config.mondai.pictureResponse", questionCount: 4, category: "listening" },
          { code: "M5", titleKey: "config.mondai.quickResponse", questionCount: 9, category: "listening" },
        ],
      },
    ]
  ),
  N4: createLevelConfig(
    "N4",
    "JLPT N4",
    90,
    [
      { id: "language_reading", titleKey: "config.sections.languageReading", maxScore: 120 },
      { id: "listening", titleKey: "config.sections.listening", maxScore: 60 },
    ],
    [
      { sectionId: "language_reading", minScore: 38, maxScore: 120 },
      { sectionId: "listening", minScore: 19, maxScore: 60 },
    ],
    [
      {
        sectionId: "language_reading",
        sectionTitleKey: "config.sections.languageReading",
        mondai: [
          { code: "M1", titleKey: "config.mondai.kanjiReading", questionCount: 9, category: "kanji" },
          { code: "M2", titleKey: "config.mondai.kanjiWritingShort", questionCount: 6, category: "kanji" },
          { code: "M3", titleKey: "config.mondai.context", questionCount: 10, category: "vocabulary" },
          { code: "M4", titleKey: "config.mondai.similarWords", questionCount: 5, category: "vocabulary" },
          { code: "M5", titleKey: "config.mondai.wordUsage", questionCount: 5, category: "vocabulary" },
          { code: "M6", titleKey: "config.mondai.grammarSentence", questionCount: 15, category: "grammar" },
          { code: "M7", titleKey: "config.mondai.sentenceArrangement", questionCount: 5, category: "grammar" },
          { code: "M8", titleKey: "config.mondai.grammarParagraph", questionCount: 5, category: "grammar" },
          { code: "M9", titleKey: "config.mondai.shortPassage", questionCount: 4, category: "reading" },
          { code: "M10", titleKey: "config.mondai.mediumPassage", questionCount: 4, category: "reading" },
          { code: "M11", titleKey: "config.mondai.informationSearch", questionCount: 2, category: "reading" },
        ],
      },
      {
        sectionId: "listening",
        sectionTitleKey: "config.sections.listening",
        mondai: [
          { code: "M1", titleKey: "config.mondai.taskUnderstanding", questionCount: 8, category: "listening" },
          { code: "M2", titleKey: "config.mondai.mainPoint", questionCount: 7, category: "listening" },
          { code: "M3", titleKey: "config.mondai.pictureResponse", questionCount: 5, category: "listening" },
          { code: "M4", titleKey: "config.mondai.quickResponse", questionCount: 8, category: "listening" },
        ],
      },
    ]
  ),
  N5: createLevelConfig(
    "N5",
    "JLPT N5",
    80,
    [
      { id: "language_reading", titleKey: "config.sections.languageReading", maxScore: 120 },
      { id: "listening", titleKey: "config.sections.listening", maxScore: 60 },
    ],
    [
      { sectionId: "language_reading", minScore: 38, maxScore: 120 },
      { sectionId: "listening", minScore: 19, maxScore: 60 },
    ],
    [
      {
        sectionId: "language_reading",
        sectionTitleKey: "config.sections.languageReading",
        mondai: [
          { code: "M1", titleKey: "config.mondai.kanjiReading", questionCount: 12, category: "kanji" },
          { code: "M2", titleKey: "config.mondai.kanjiWritingShort", questionCount: 8, category: "kanji" },
          { code: "M3", titleKey: "config.mondai.context", questionCount: 10, category: "vocabulary" },
          { code: "M4", titleKey: "config.mondai.similarWords", questionCount: 5, category: "vocabulary" },
          { code: "M5", titleKey: "config.mondai.grammarSentence", questionCount: 16, category: "grammar" },
          { code: "M6", titleKey: "config.mondai.sentenceArrangement", questionCount: 5, category: "grammar" },
          { code: "M7", titleKey: "config.mondai.grammarParagraph", questionCount: 5, category: "grammar" },
          { code: "M8", titleKey: "config.mondai.shortPassage", questionCount: 3, category: "reading" },
          { code: "M9", titleKey: "config.mondai.mediumPassage", questionCount: 2, category: "reading" },
          { code: "M10", titleKey: "config.mondai.informationSearch", questionCount: 1, category: "reading" },
        ],
      },
      {
        sectionId: "listening",
        sectionTitleKey: "config.sections.listening",
        mondai: [
          { code: "M1", titleKey: "config.mondai.taskUnderstanding", questionCount: 7, category: "listening" },
          { code: "M2", titleKey: "config.mondai.mainPoint", questionCount: 6, category: "listening" },
          { code: "M3", titleKey: "config.mondai.pictureResponse", questionCount: 5, category: "listening" },
          { code: "M4", titleKey: "config.mondai.quickResponse", questionCount: 6, category: "listening" },
        ],
      },
    ]
  ),
}

export const jlptLevels = Object.keys(jlptConfigs) as Array<keyof typeof jlptConfigs>
