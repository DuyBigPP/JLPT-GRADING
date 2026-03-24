import { useEffect, useMemo, useState } from "react"
import { AlertTriangle, CheckCircle2, Gauge, RotateCcw, Scale } from "lucide-react"
import { jlptConfigs, jlptLevels } from "@/features/jlpt-grading/config"
import { calculateEstimatedScore, createInitialInputs } from "@/features/jlpt-grading/scoring"
import { GradingInputState, JlptLevel, MondaiConfig } from "@/features/jlpt-grading/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const formatScore = (value: number) => value.toFixed(2)

const getQuestionCountRange = (mondai: MondaiConfig) => ({
  min: Math.max(1, mondai.questionCount - 1),
  max: mondai.questionCount + 1,
})

const getQuestionCountError = (mondai: MondaiConfig, value: number) => {
  const range = getQuestionCountRange(mondai)

  if (value < range.min) {
    return `Không được nhỏ hơn ${range.min}`
  }

  if (value > range.max) {
    return `Không được lớn hơn ${range.max}`
  }

  return ""
}

const getCountError = (value: number, adjustedQuestionCount: number) => {
  if (value < 0) {
    return "Không được nhỏ hơn 0"
  }

  if (value > adjustedQuestionCount) {
    return `Vượt quá số câu tối đa (${adjustedQuestionCount})`
  }

  return ""
}

const getWeightError = (value: number) => {
  if (value <= 0) {
    return "Trọng số phải lớn hơn 0"
  }

  if (value > 10) {
    return "Trọng số quá cao (tối đa 10)"
  }

  return ""
}

export function GradingCalculator() {
  const [level, setLevel] = useState<JlptLevel>("N1")
  const levelConfig = jlptConfigs[level]

  const [inputs, setInputs] = useState<GradingInputState>(() => createInitialInputs(levelConfig))

  useEffect(() => {
    setInputs(createInitialInputs(levelConfig))
  }, [levelConfig])

  const result = useMemo(() => calculateEstimatedScore(levelConfig, inputs), [levelConfig, inputs])

  const invalidCountIds = useMemo(
    () =>
      new Set(
        levelConfig.mondai.filter((mondai) => {
          const questionCount = inputs[mondai.id]?.questionCount ?? mondai.questionCount
          const hasQuestionCountError = Boolean(getQuestionCountError(mondai, questionCount))
          const hasCorrectCountError = Boolean(getCountError(inputs[mondai.id]?.correctCount ?? 0, questionCount))
          return hasQuestionCountError || hasCorrectCountError
        }).map((mondai) => mondai.id)
      ),
    [levelConfig.mondai, inputs]
  )

  const invalidWeightIds = useMemo(
    () =>
      new Set(
        levelConfig.mondai
          .filter((mondai) => Boolean(getWeightError(inputs[mondai.id]?.weight ?? mondai.defaultWeight)))
          .map((mondai) => mondai.id)
      ),
    [levelConfig.mondai, inputs]
  )

  const hasValidationIssue = invalidCountIds.size > 0 || invalidWeightIds.size > 0

  const updateCorrectCount = (mondaiId: string, nextValue: string) => {
    const parsed = Number(nextValue)
    const value = Number.isNaN(parsed) ? 0 : parsed

    setInputs((previous) => ({
      ...previous,
      [mondaiId]: {
        ...previous[mondaiId],
        correctCount: value,
      },
    }))
  }

  const updateQuestionCount = (mondaiId: string, nextValue: string) => {
    const parsed = Number(nextValue)
    const value = Number.isNaN(parsed) ? 0 : parsed

    setInputs((previous) => ({
      ...previous,
      [mondaiId]: {
        ...previous[mondaiId],
        questionCount: value,
      },
    }))
  }

  const updateWeight = (mondaiId: string, nextValue: string) => {
    const parsed = Number(nextValue)
    const value = Number.isNaN(parsed) ? 0 : parsed

    setInputs((previous) => ({
      ...previous,
      [mondaiId]: {
        ...previous[mondaiId],
        weight: value,
      },
    }))
  }

  const resetWeights = () => {
    setInputs((previous) => {
      const next = { ...previous }
      levelConfig.mondai.forEach((mondai) => {
        next[mondai.id] = {
          ...next[mondai.id],
          weight: mondai.defaultWeight,
        }
      })
      return next
    })
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      <Card className="overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 via-card to-accent/10">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs tracking-wide uppercase">
              Công cụ chấm điểm thi thử JLPT
            </Badge>
            <CardTitle className="text-2xl leading-tight sm:text-3xl">
              Tính điểm ước tính theo từng mondai
            </CardTitle>
            <CardDescription className="max-w-3xl text-sm sm:text-base">
              Chọn cấp độ, nhập số câu đúng, tùy chỉnh trọng số để mô phỏng đề thi. Kết quả hiển thị theo
              mức tham khảo và điều kiện điểm liệt.
            </CardDescription>
          </div>
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm font-medium">Cấp độ thi</p>
            <ToggleGroup
              type="single"
              value={level}
              onValueChange={(value) => {
                if (value) {
                  setLevel(value as JlptLevel)
                }
              }}
              variant="outline"
              className="w-full"
            >
              {jlptLevels.map((item) => (
                <ToggleGroupItem key={item} value={item} className="px-4 text-sm sm:px-5">
                  {item}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">Bảng nhập đáp án đúng - {levelConfig.title}</CardTitle>
            <CardDescription>
              Mỗi mondai có thể điều chỉnh tổng số câu trong biên ±1 để bám sát đề thực tế. Có thể reset
              nhanh trọng số về giá trị mặc định.
            </CardDescription>
          </div>
          <Button variant="outline" onClick={resetWeights}>
            <RotateCcw data-icon="inline-start" />
            Reset trọng số
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {levelConfig.sections.map((section) => {
            const sectionMondai = levelConfig.mondai.filter((mondai) => mondai.sectionId === section.id)

            return (
              <div key={section.id} className="flex flex-col gap-4 rounded-lg border border-border/60 p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-base font-semibold">{section.title}</h3>
                  <Badge variant="outline">Tối đa {section.maxScore} điểm</Badge>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[34%]">Mondai</TableHead>
                      <TableHead className="w-[14%]">Số câu đúng</TableHead>
                      <TableHead className="w-[14%]">Tổng câu</TableHead>
                      <TableHead className="w-[20%]">Trọng số</TableHead>
                      <TableHead className="w-[18%]">Khoảng gợi ý</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sectionMondai.map((mondai) => {
                      const currentInput = inputs[mondai.id]
                      const questionCount = currentInput?.questionCount ?? mondai.questionCount
                      const questionCountRange = getQuestionCountRange(mondai)
                      const questionCountError = getQuestionCountError(mondai, questionCount)
                      const countError = getCountError(currentInput?.correctCount ?? 0, questionCount)
                      const weightError = getWeightError(currentInput?.weight ?? mondai.defaultWeight)

                      return (
                        <TableRow key={mondai.id}>
                          <TableCell className="align-top">
                            <div className="flex flex-col gap-1">
                              <p className="font-medium">{mondai.code}</p>
                              <p className="text-muted-foreground text-xs">{mondai.title}</p>
                            </div>
                          </TableCell>
                          <TableCell className="align-top">
                            <Input
                              type="number"
                              min={0}
                              max={questionCount}
                              value={currentInput?.correctCount ?? 0}
                              aria-invalid={Boolean(countError)}
                              onChange={(event) => updateCorrectCount(mondai.id, event.target.value)}
                            />
                            {countError ? (
                              <p className="mt-1 text-xs text-destructive">{countError}</p>
                            ) : null}
                          </TableCell>
                          <TableCell className="align-top">
                            <Input
                              type="number"
                              min={questionCountRange.min}
                              max={questionCountRange.max}
                              value={questionCount}
                              aria-invalid={Boolean(questionCountError)}
                              onChange={(event) => updateQuestionCount(mondai.id, event.target.value)}
                            />
                            <p className="text-muted-foreground mt-1 text-xs">
                              Chuẩn: {mondai.questionCount} (cho phép {questionCountRange.min} - {questionCountRange.max})
                            </p>
                            {questionCountError ? (
                              <p className="mt-1 text-xs text-destructive">{questionCountError}</p>
                            ) : null}
                          </TableCell>
                          <TableCell className="align-top">
                            <Input
                              type="number"
                              step="0.1"
                              min={0.1}
                              max={10}
                              value={currentInput?.weight ?? mondai.defaultWeight}
                              aria-invalid={Boolean(weightError)}
                              onChange={(event) => updateWeight(mondai.id, event.target.value)}
                            />
                            {weightError ? (
                              <p className="mt-1 text-xs text-destructive">{weightError}</p>
                            ) : null}
                          </TableCell>
                          <TableCell className="align-top">
                            {mondai.recommendedRange.min} - {mondai.recommendedRange.max}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )
          })}

          <div className="text-muted-foreground text-xs">
            Công thức sử dụng:
            <span className="ml-1 font-medium text-foreground">
              điểm section = (tổng điểm trọng số đạt được / tổng điểm trọng số tối đa) x điểm tối đa section.
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Gauge className="size-5" />
            Kết quả ước tính
          </CardTitle>
          <CardDescription>
            Điểm tổng và điều kiện đỗ được tính lại theo thời gian thực sau mỗi lần thay đổi dữ liệu.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-lg border border-border/70 bg-card p-4">
              <p className="text-muted-foreground text-sm">Tổng điểm ước tính</p>
              <p className="mt-2 text-3xl font-semibold">{formatScore(result.totalEstimatedScore)}</p>
              <p className="text-muted-foreground mt-1 text-sm">/ {result.totalMaxScore} điểm</p>
            </div>
            <div className="rounded-lg border border-border/70 bg-card p-4">
              <p className="text-muted-foreground text-sm">Ngưỡng đỗ</p>
              <p className="mt-2 text-3xl font-semibold">{result.totalPassScore}</p>
              <p className="text-muted-foreground mt-1 text-sm">điểm trở lên</p>
            </div>
            <div className="rounded-lg border border-border/70 bg-card p-4">
              <p className="text-muted-foreground text-sm">Kết luận</p>
              <div className="mt-2 flex items-center gap-2">
                {result.pass && !hasValidationIssue ? (
                  <>
                    <CheckCircle2 className="size-5 text-primary" />
                    <Badge className="text-sm">Đủ điều kiện đỗ</Badge>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="size-5 text-destructive" />
                    <Badge variant="destructive" className="text-sm">
                      Chưa đủ điều kiện
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {result.sectionResults.map((section) => {
              const minRule = levelConfig.sectionMinimums.find((rule) => rule.sectionId === section.sectionId)
              const failed = result.sectionFailures.some((item) => item.sectionId === section.sectionId)

              return (
                <div key={section.sectionId} className="rounded-lg border border-border/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">{section.title}</p>
                    <Badge variant={failed ? "destructive" : "secondary"}>
                      {formatScore(section.normalizedScore)} / {section.maxScore}
                    </Badge>
                  </div>
                  {minRule ? (
                    <p className="text-muted-foreground mt-2 text-xs">
                      Điểm liệt: {minRule.minScore}/{minRule.maxScore}
                    </p>
                  ) : null}
                  <p className="text-muted-foreground mt-2 text-xs">
                    Ước tính: {section.rawWeightedEarned} / {section.rawWeightedMax}
                  </p>
                </div>
              )
            })}
          </div>

          {hasValidationIssue ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm">
              Có input đang không hợp lệ. Kết quả hiện tại đã được tính với giá trị giới hạn an toàn để tránh sai lệch.
            </div>
          ) : null}

          {result.sectionFailures.length > 0 ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm">
              <p className="mb-2 flex items-center gap-2 font-medium text-destructive">
                <Scale className="size-4" />
                Không đạt điều kiện điểm liệt
              </p>
              <ul className="flex list-disc flex-col gap-1 pl-5 text-destructive/90">
                {result.sectionFailures.map((failure) => {
                  const section = result.sectionResults.find((item) => item.sectionId === failure.sectionId)
                  return (
                    <li key={failure.sectionId}>
                      {section?.title}: {formatScore(failure.currentScore)} {"<"} {failure.minScore}
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
