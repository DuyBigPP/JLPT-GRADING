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
  title: string
  questionCount: number
  category: MondaiCategory
}

type SectionSeed = {
  sectionId: "language" | "reading" | "language_reading" | "listening"
  sectionTitle: string
  mondai: MondaiSeed[]
}

function createMondai(level: string, sectionId: SectionSeed["sectionId"], seed: MondaiSeed) {
  return {
    id: `${level}-${sectionId}-${seed.code}`,
    code: seed.code,
    title: seed.title,
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
      { id: "language", title: "Kiến thức ngôn ngữ", maxScore: 60 },
      { id: "reading", title: "Đọc hiểu", maxScore: 60 },
      { id: "listening", title: "Nghe hiểu", maxScore: 60 },
    ],
    [
      { sectionId: "language", minScore: 19, maxScore: 60 },
      { sectionId: "reading", minScore: 19, maxScore: 60 },
      { sectionId: "listening", minScore: 19, maxScore: 60 },
    ],
    [
      {
        sectionId: "language",
        sectionTitle: "Kiến thức ngôn ngữ",
        mondai: [
          { code: "M1", title: "Cách đọc Kanji", questionCount: 6, category: "kanji" },
          { code: "M2", title: "Ngữ cảnh", questionCount: 7, category: "vocabulary" },
          { code: "M3", title: "Từ gần nghĩa", questionCount: 6, category: "vocabulary" },
          { code: "M4", title: "Cách sử dụng từ", questionCount: 6, category: "vocabulary" },
          { code: "M5", title: "Ngữ pháp trong câu", questionCount: 10, category: "grammar" },
          { code: "M6", title: "Sắp xếp sao", questionCount: 5, category: "grammar" },
          { code: "M7", title: "Ngữ pháp đoạn văn", questionCount: 4, category: "grammar" },
        ],
      },
      {
        sectionId: "reading",
        sectionTitle: "Đọc hiểu",
        mondai: [
          { code: "M8", title: "Đoạn ngắn", questionCount: 4, category: "reading" },
          { code: "M9", title: "Đoạn trung", questionCount: 9, category: "reading" },
          { code: "M10", title: "Đoạn dài", questionCount: 3, category: "reading" },
          { code: "M11", title: "Đọc hiểu tổng hợp", questionCount: 2, category: "reading" },
          { code: "M12", title: "Chủ đề dài", questionCount: 3, category: "reading" },
          { code: "M13", title: "Tìm kiếm thông tin", questionCount: 2, category: "reading" },
        ],
      },
      {
        sectionId: "listening",
        sectionTitle: "Nghe hiểu",
        mondai: [
          { code: "M1", title: "Hiểu nhiệm vụ", questionCount: 5, category: "listening" },
          { code: "M2", title: "Hiểu điểm chính", questionCount: 6, category: "listening" },
          { code: "M3", title: "Hiểu khái quát", questionCount: 5, category: "listening" },
          { code: "M4", title: "Phản xạ nhanh", questionCount: 11, category: "listening" },
          { code: "M5", title: "Hiểu tổng hợp", questionCount: 3, category: "listening" },
        ],
      },
    ]
  ),
  N2: createLevelConfig(
    "N2",
    "JLPT N2",
    90,
    [
      { id: "language", title: "Kiến thức ngôn ngữ", maxScore: 60 },
      { id: "reading", title: "Đọc hiểu", maxScore: 60 },
      { id: "listening", title: "Nghe hiểu", maxScore: 60 },
    ],
    [
      { sectionId: "language", minScore: 19, maxScore: 60 },
      { sectionId: "reading", minScore: 19, maxScore: 60 },
      { sectionId: "listening", minScore: 19, maxScore: 60 },
    ],
    [
      {
        sectionId: "language",
        sectionTitle: "Kiến thức ngôn ngữ",
        mondai: [
          { code: "M1", title: "Cách đọc Kanji", questionCount: 5, category: "kanji" },
          { code: "M2", title: "Cách viết Kanji", questionCount: 5, category: "kanji" },
          { code: "M3", title: "Cấu tạo từ", questionCount: 3, category: "vocabulary" },
          { code: "M4", title: "Ngữ cảnh", questionCount: 7, category: "vocabulary" },
          { code: "M5", title: "Từ gần nghĩa", questionCount: 5, category: "vocabulary" },
          { code: "M6", title: "Cách sử dụng từ", questionCount: 5, category: "vocabulary" },
          { code: "M7", title: "Ngữ pháp trong câu", questionCount: 12, category: "grammar" },
          { code: "M8", title: "Sắp xếp sao", questionCount: 5, category: "grammar" },
          { code: "M9", title: "Ngữ pháp đoạn văn", questionCount: 4, category: "grammar" },
        ],
      },
      {
        sectionId: "reading",
        sectionTitle: "Đọc hiểu",
        mondai: [
          { code: "M10", title: "Đoạn ngắn", questionCount: 5, category: "reading" },
          { code: "M11", title: "Đoạn trung", questionCount: 9, category: "reading" },
          { code: "M12", title: "Đọc hiểu tổng hợp", questionCount: 2, category: "reading" },
          { code: "M13", title: "Chủ đề dài", questionCount: 3, category: "reading" },
          { code: "M14", title: "Tìm kiếm thông tin", questionCount: 2, category: "reading" },
        ],
      },
      {
        sectionId: "listening",
        sectionTitle: "Nghe hiểu",
        mondai: [
          { code: "M1", title: "Hiểu nhiệm vụ", questionCount: 5, category: "listening" },
          { code: "M2", title: "Hiểu điểm chính", questionCount: 6, category: "listening" },
          { code: "M3", title: "Hiểu khái quát", questionCount: 5, category: "listening" },
          { code: "M4", title: "Phản xạ nhanh", questionCount: 11, category: "listening" },
          { code: "M5", title: "Hiểu tổng hợp", questionCount: 4, category: "listening" },
        ],
      },
    ]
  ),
  N3: createLevelConfig(
    "N3",
    "JLPT N3",
    95,
    [
      { id: "language", title: "Từ vựng", maxScore: 60 },
      { id: "reading", title: "Ngữ pháp & Đọc hiểu", maxScore: 60 },
      { id: "listening", title: "Nghe hiểu", maxScore: 60 },
    ],
    [
      { sectionId: "language", minScore: 19, maxScore: 60 },
      { sectionId: "reading", minScore: 19, maxScore: 60 },
      { sectionId: "listening", minScore: 19, maxScore: 60 },
    ],
    [
      {
        sectionId: "language",
        sectionTitle: "Từ vựng",
        mondai: [
          { code: "M1", title: "Cách đọc Kanji", questionCount: 8, category: "kanji" },
          { code: "M2", title: "Cách viết Kanji", questionCount: 6, category: "kanji" },
          { code: "M3", title: "Ngữ cảnh", questionCount: 11, category: "vocabulary" },
          { code: "M4", title: "Từ gần nghĩa", questionCount: 5, category: "vocabulary" },
          { code: "M5", title: "Cách sử dụng từ", questionCount: 5, category: "vocabulary" },
        ],
      },
      {
        sectionId: "reading",
        sectionTitle: "Ngữ pháp & Đọc hiểu",
        mondai: [
          { code: "M1", title: "Ngữ pháp trong câu", questionCount: 13, category: "grammar" },
          { code: "M2", title: "Sắp xếp sao", questionCount: 5, category: "grammar" },
          { code: "M3", title: "Ngữ pháp đoạn văn", questionCount: 4, category: "grammar" },
          { code: "M4", title: "Đoạn ngắn", questionCount: 4, category: "reading" },
          { code: "M5", title: "Đoạn trung", questionCount: 6, category: "reading" },
          { code: "M6", title: "Đoạn dài", questionCount: 4, category: "reading" },
          { code: "M7", title: "Tìm kiếm thông tin", questionCount: 2, category: "reading" },
        ],
      },
      {
        sectionId: "listening",
        sectionTitle: "Nghe hiểu",
        mondai: [
          { code: "M1", title: "Hiểu nhiệm vụ", questionCount: 6, category: "listening" },
          { code: "M2", title: "Hiểu điểm chính", questionCount: 6, category: "listening" },
          { code: "M3", title: "Hiểu khái quát", questionCount: 3, category: "listening" },
          { code: "M4", title: "Phản xạ nhìn tranh", questionCount: 4, category: "listening" },
          { code: "M5", title: "Phản xạ nhanh", questionCount: 9, category: "listening" },
        ],
      },
    ]
  ),
  N4: createLevelConfig(
    "N4",
    "JLPT N4",
    90,
    [
      { id: "language_reading", title: "Ngôn ngữ & Đọc hiểu", maxScore: 120 },
      { id: "listening", title: "Nghe hiểu", maxScore: 60 },
    ],
    [
      { sectionId: "language_reading", minScore: 38, maxScore: 120 },
      { sectionId: "listening", minScore: 19, maxScore: 60 },
    ],
    [
      {
        sectionId: "language_reading",
        sectionTitle: "Ngôn ngữ & Đọc hiểu",
        mondai: [
          { code: "M1", title: "Cách đọc Kanji", questionCount: 9, category: "kanji" },
          { code: "M2", title: "Cách viết", questionCount: 6, category: "kanji" },
          { code: "M3", title: "Ngữ cảnh", questionCount: 10, category: "vocabulary" },
          { code: "M4", title: "Từ gần nghĩa", questionCount: 5, category: "vocabulary" },
          { code: "M5", title: "Cách sử dụng từ", questionCount: 5, category: "vocabulary" },
          { code: "M6", title: "Ngữ pháp trong câu", questionCount: 15, category: "grammar" },
          { code: "M7", title: "Sắp xếp sao", questionCount: 5, category: "grammar" },
          { code: "M8", title: "Ngữ pháp đoạn văn", questionCount: 5, category: "grammar" },
          { code: "M9", title: "Đoạn ngắn", questionCount: 4, category: "reading" },
          { code: "M10", title: "Đoạn trung", questionCount: 4, category: "reading" },
          { code: "M11", title: "Tìm kiếm thông tin", questionCount: 2, category: "reading" },
        ],
      },
      {
        sectionId: "listening",
        sectionTitle: "Nghe hiểu",
        mondai: [
          { code: "M1", title: "Hiểu nhiệm vụ", questionCount: 8, category: "listening" },
          { code: "M2", title: "Hiểu điểm chính", questionCount: 7, category: "listening" },
          { code: "M3", title: "Phản xạ nhìn tranh", questionCount: 5, category: "listening" },
          { code: "M4", title: "Phản xạ nhanh", questionCount: 8, category: "listening" },
        ],
      },
    ]
  ),
  N5: createLevelConfig(
    "N5",
    "JLPT N5",
    80,
    [
      { id: "language_reading", title: "Ngôn ngữ & Đọc hiểu", maxScore: 120 },
      { id: "listening", title: "Nghe hiểu", maxScore: 60 },
    ],
    [
      { sectionId: "language_reading", minScore: 38, maxScore: 120 },
      { sectionId: "listening", minScore: 19, maxScore: 60 },
    ],
    [
      {
        sectionId: "language_reading",
        sectionTitle: "Ngôn ngữ & Đọc hiểu",
        mondai: [
          { code: "M1", title: "Cách đọc Kanji", questionCount: 12, category: "kanji" },
          { code: "M2", title: "Cách viết", questionCount: 8, category: "kanji" },
          { code: "M3", title: "Ngữ cảnh", questionCount: 10, category: "vocabulary" },
          { code: "M4", title: "Từ gần nghĩa", questionCount: 5, category: "vocabulary" },
          { code: "M5", title: "Ngữ pháp trong câu", questionCount: 16, category: "grammar" },
          { code: "M6", title: "Sắp xếp sao", questionCount: 5, category: "grammar" },
          { code: "M7", title: "Ngữ pháp đoạn văn", questionCount: 5, category: "grammar" },
          { code: "M8", title: "Đoạn ngắn", questionCount: 3, category: "reading" },
          { code: "M9", title: "Đoạn trung", questionCount: 2, category: "reading" },
          { code: "M10", title: "Tìm kiếm thông tin", questionCount: 1, category: "reading" },
        ],
      },
      {
        sectionId: "listening",
        sectionTitle: "Nghe hiểu",
        mondai: [
          { code: "M1", title: "Hiểu nhiệm vụ", questionCount: 7, category: "listening" },
          { code: "M2", title: "Hiểu điểm chính", questionCount: 6, category: "listening" },
          { code: "M3", title: "Phản xạ nhìn tranh", questionCount: 5, category: "listening" },
          { code: "M4", title: "Phản xạ nhanh", questionCount: 6, category: "listening" },
        ],
      },
    ]
  ),
}

export const jlptLevels = Object.keys(jlptConfigs) as Array<keyof typeof jlptConfigs>
