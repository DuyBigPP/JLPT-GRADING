import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
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

const parseNumberInput = (value: string) => {
  if (value === "") {
    return ""
  }

  const parsed = Number(value)
  return Number.isNaN(parsed) ? "" : parsed
}

type TFn = (key: string, options?: Record<string, unknown>) => string

const getQuestionCountError = (t: TFn, mondai: MondaiConfig, value: number) => {
  const range = getQuestionCountRange(mondai)
  if (value < range.min) {
    return t("grading.errorMinQuestionCount", { min: range.min })
  }
  if (value > range.max) {
    return t("grading.errorMaxQuestionCount", { max: range.max })
  }
  return ""
}

const getCountError = (t: TFn, value: number, adjustedQuestionCount: number) => {
  if (value < 0) {
    return t("grading.errorMinCorrectCount")
  }
  if (value > adjustedQuestionCount) {
    return t("grading.errorMaxCorrectCount", { max: adjustedQuestionCount })
  }
  return ""
}

const getWeightError = (t: TFn, value: number) => {
  if (value <= 0) {
    return t("grading.errorWeightMin")
  }
  if (value > 10) {
    return t("grading.errorWeightMax")
  }
  return ""
}

export function GradingCalculator() {
  const { t } = useTranslation()
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
          const correctCount = inputs[mondai.id]?.correctCount ?? 0
          const questionCountInput = inputs[mondai.id]?.questionCount ?? mondai.questionCount
          const questionCount = questionCountInput === "" ? mondai.questionCount : questionCountInput
          const hasQuestionCountError = questionCountInput === "" ? false : Boolean(getQuestionCountError(t, mondai, questionCount))
          const hasCorrectCountError = correctCount === "" ? false : Boolean(getCountError(t, correctCount, questionCount))
          return hasQuestionCountError || hasCorrectCountError
        }).map((mondai) => mondai.id)
      ),
    [levelConfig.mondai, inputs, t]
  )

  const invalidWeightIds = useMemo(
    () =>
      new Set(
        levelConfig.mondai
          .filter((mondai) => {
            const weight = inputs[mondai.id]?.weight ?? mondai.defaultWeight
            return weight === "" ? false : Boolean(getWeightError(t, weight))
          })
          .map((mondai) => mondai.id)
      ),
    [levelConfig.mondai, inputs, t]
  )

  const hasValidationIssue = invalidCountIds.size > 0 || invalidWeightIds.size > 0

  const updateCorrectCount = (mondaiId: string, nextValue: string) => {
    setInputs((previous) => ({
      ...previous,
      [mondaiId]: {
        ...previous[mondaiId],
        correctCount: parseNumberInput(nextValue),
      },
    }))
  }

  const updateQuestionCount = (mondaiId: string, nextValue: string) => {
    setInputs((previous) => ({
      ...previous,
      [mondaiId]: {
        ...previous[mondaiId],
        questionCount: parseNumberInput(nextValue),
      },
    }))
  }

  const updateWeight = (mondaiId: string, nextValue: string) => {
    setInputs((previous) => ({
      ...previous,
      [mondaiId]: {
        ...previous[mondaiId],
        weight: parseNumberInput(nextValue),
      },
    }))
  }

  const restoreEmptyInput = (mondai: MondaiConfig, field: keyof GradingInputState[string]) => {
    setInputs((previous) => {
      const currentInput = previous[mondai.id]

      if (!currentInput || currentInput[field] !== "") {
        return previous
      }

      const fallbackValues = {
        correctCount: 0,
        questionCount: mondai.questionCount,
        weight: mondai.defaultWeight,
      }

      return {
        ...previous,
        [mondai.id]: {
          ...currentInput,
          [field]: fallbackValues[field],
        },
      }
    })
  }

  const clearDefaultInput = (mondai: MondaiConfig, field: keyof GradingInputState[string]) => {
    setInputs((previous) => {
      const currentInput = previous[mondai.id]
      if (!currentInput) {
        return previous
      }

      const defaultValues = {
        correctCount: 0,
        questionCount: mondai.questionCount,
        weight: mondai.defaultWeight,
      }

      if (currentInput[field] !== defaultValues[field]) {
        return previous
      }

      return {
        ...previous,
        [mondai.id]: {
          ...currentInput,
          [field]: "",
        },
      }
    })
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
              {t("grading.badge")}
            </Badge>
            <CardTitle className="text-2xl leading-tight sm:text-3xl">
              {t("grading.title")}
            </CardTitle>
            <CardDescription className="max-w-3xl text-sm sm:text-base">
              {t("grading.description")}
            </CardDescription>
          </div>
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm font-medium">{t("grading.examLevel")}</p>
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
            <CardTitle className="text-xl">{t("grading.inputTableTitle", { level: levelConfig.title })}</CardTitle>
            <CardDescription>
              {t("grading.inputTableDescription")}
            </CardDescription>
          </div>
          <Button variant="outline" onClick={resetWeights}>
            <RotateCcw data-icon="inline-start" />
            {t("grading.resetWeights")}
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {levelConfig.sections.map((section) => {
            const sectionMondai = levelConfig.mondai.filter((mondai) => mondai.sectionId === section.id)

            return (
              <div key={section.id} className="flex flex-col gap-4 rounded-lg border border-border/60 p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-base font-semibold">{t(section.titleKey)}</h3>
                  <Badge variant="outline">{t("grading.maxScore", { score: section.maxScore })}</Badge>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[34%]">{t("grading.colMondai")}</TableHead>
                      <TableHead className="w-[14%]">{t("grading.colCorrectCount")}</TableHead>
                      <TableHead className="w-[14%]">{t("grading.colTotalQuestions")}</TableHead>
                      <TableHead className="w-[20%]">{t("grading.colWeight")}</TableHead>
                      <TableHead className="w-[18%]">{t("grading.colSuggestedRange")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sectionMondai.map((mondai) => {
                      const currentInput = inputs[mondai.id]
                      const correctCount = currentInput?.correctCount ?? 0
                      const questionCountInput = currentInput?.questionCount ?? mondai.questionCount
                      const weight = currentInput?.weight ?? mondai.defaultWeight
                      const questionCount = questionCountInput === "" ? mondai.questionCount : questionCountInput
                      const questionCountRange = getQuestionCountRange(mondai)
                      const questionCountError = questionCountInput === "" ? "" : getQuestionCountError(t, mondai, questionCount)
                      const countError = correctCount === "" ? "" : getCountError(t, correctCount, questionCount)
                      const weightError = weight === "" ? "" : getWeightError(t, weight)

                      return (
                        <TableRow key={mondai.id}>
                          <TableCell className="align-top">
                            <div className="flex flex-col gap-1">
                              <p className="font-medium">{mondai.code}</p>
                              <p className="text-muted-foreground text-xs">{t(mondai.titleKey)}</p>
                            </div>
                          </TableCell>
                          <TableCell className="align-top">
                            <Input
                              type="number"
                              min={0}
                              max={questionCount}
                              value={correctCount}
                              aria-invalid={Boolean(countError)}
                              onFocus={() => clearDefaultInput(mondai, "correctCount")}
                              onChange={(event) => updateCorrectCount(mondai.id, event.target.value)}
                              onBlur={() => restoreEmptyInput(mondai, "correctCount")}
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
                              value={questionCountInput}
                              aria-invalid={Boolean(questionCountError)}
                              onFocus={() => clearDefaultInput(mondai, "questionCount")}
                              onChange={(event) => updateQuestionCount(mondai.id, event.target.value)}
                              onBlur={() => restoreEmptyInput(mondai, "questionCount")}
                            />
                            <p className="text-muted-foreground mt-1 text-xs">
                              {t("grading.standard", { count: mondai.questionCount, min: questionCountRange.min, max: questionCountRange.max })}
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
                              value={weight}
                              aria-invalid={Boolean(weightError)}
                              onFocus={() => clearDefaultInput(mondai, "weight")}
                              onChange={(event) => updateWeight(mondai.id, event.target.value)}
                              onBlur={() => restoreEmptyInput(mondai, "weight")}
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
            {t("grading.formulaLabel")}
            <span className="ml-1 font-medium text-foreground">
              {t("grading.formulaText")}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Gauge className="size-5" />
            {t("grading.resultsTitle")}
          </CardTitle>
          <CardDescription>
            {t("grading.resultsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-lg border border-border/70 bg-card p-4">
              <p className="text-muted-foreground text-sm">{t("grading.totalEstimated")}</p>
              <p className="mt-2 text-3xl font-semibold">{formatScore(result.totalEstimatedScore)}</p>
              <p className="text-muted-foreground mt-1 text-sm">{t("grading.totalPoints", { score: result.totalMaxScore })}</p>
            </div>
            <div className="rounded-lg border border-border/70 bg-card p-4">
              <p className="text-muted-foreground text-sm">{t("grading.passThreshold")}</p>
              <p className="mt-2 text-3xl font-semibold">{result.totalPassScore}</p>
              <p className="text-muted-foreground mt-1 text-sm">{t("grading.pointsAndAbove")}</p>
            </div>
            <div className="rounded-lg border border-border/70 bg-card p-4">
              <p className="text-muted-foreground text-sm">{t("grading.conclusion")}</p>
              <div className="mt-2 flex items-center gap-2">
                {result.pass && !hasValidationIssue ? (
                  <>
                    <CheckCircle2 className="size-5 text-primary" />
                    <Badge className="text-sm">{t("grading.pass")}</Badge>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="size-5 text-destructive" />
                    <Badge variant="destructive" className="text-sm">
                      {t("grading.fail")}
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
                    <p className="text-sm font-medium">{t(section.titleKey)}</p>
                    <Badge variant={failed ? "destructive" : "secondary"}>
                      {formatScore(section.normalizedScore)} / {section.maxScore}
                    </Badge>
                  </div>
                  {minRule ? (
                    <p className="text-muted-foreground mt-2 text-xs">
                      {t("grading.minScore", { min: minRule.minScore, max: minRule.maxScore })}
                    </p>
                  ) : null}
                  <p className="text-muted-foreground mt-2 text-xs">
                    {t("grading.estimated", { earned: section.rawWeightedEarned, max: section.rawWeightedMax })}
                  </p>
                </div>
              )
            })}
          </div>

          {hasValidationIssue ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm">
              {t("grading.validationWarning")}
            </div>
          ) : null}

          {result.sectionFailures.length > 0 ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm">
              <p className="mb-2 flex items-center gap-2 font-medium text-destructive">
                <Scale className="size-4" />
                {t("grading.sectionFailTitle")}
              </p>
              <ul className="flex list-disc flex-col gap-1 pl-5 text-destructive/90">
                {result.sectionFailures.map((failure) => {
                  const section = result.sectionResults.find((item) => item.sectionId === failure.sectionId)
                  return (
                    <li key={failure.sectionId}>
                      {section ? t(section.titleKey) : ""}: {formatScore(failure.currentScore)} {"<"} {failure.minScore}
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
