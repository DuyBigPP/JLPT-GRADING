import { useTranslation } from "react-i18next"
import { BookOpenCheck, Calculator, CircleAlert, ListChecks, Radar } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SEO } from "@/components/common/SEO"

export default function DashboardPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-6 pb-10">
      <SEO
        title={t("dashboard.seoTitle")}
        description={t("dashboard.seoDescription")}
        path="/dashboard"
      />
      <Card className="overflow-hidden border-primary/30 bg-gradient-to-r from-primary/10 via-card to-accent/15">
        <CardHeader>
          <Badge variant="secondary" className="w-fit rounded-full px-3 py-1 uppercase tracking-wide">
            {t("dashboard.badge")}
          </Badge>
          <CardTitle className="mt-2 text-3xl leading-tight">{t("dashboard.title")}</CardTitle>
          <CardDescription className="max-w-3xl text-sm sm:text-base">
            {t("dashboard.description")}
          </CardDescription>
        </CardHeader>
      </Card>

      <Alert className="border-destructive/40 bg-destructive/5">
        <CircleAlert />
        <AlertTitle className="font-semibold text-destructive">{t("dashboard.warningTitle")}</AlertTitle>
        <AlertDescription className="text-destructive/90">
          {t("dashboard.warningDescription")}
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ListChecks className="size-5" />
              {t("dashboard.quickFlowTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
            <p>{t("dashboard.quickFlowStep1")}</p>
            <p>{t("dashboard.quickFlowStep2")}</p>
            <p>{t("dashboard.quickFlowStep3")}</p>
            <p>{t("dashboard.quickFlowStep4")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="size-5" />
              {t("dashboard.scoringTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
            <p>{t("dashboard.scoringFormula")}</p>
            <p>{t("dashboard.scoringTotal")}</p>
            <p>{t("dashboard.scoringCondition")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Radar className="size-5" />
              {t("dashboard.notesTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
            <p>{t("dashboard.notesFluctuation")}</p>
            <p>{t("dashboard.notesWeight")}</p>
            <p>{t("dashboard.notesUsage")}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpenCheck className="size-5" />
            {t("dashboard.readResultsTitle")}
          </CardTitle>
          <CardDescription>
            {t("dashboard.readResultsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground">
          <div className="flex flex-col gap-2">
            <p>{t("dashboard.readResultsFailure")}</p>
            <p>{t("dashboard.readResultsWeight")}</p>
          </div>
          <Separator />
          <Alert className="border-primary/40 bg-primary/5">
            <CircleAlert />
            <AlertTitle>{t("dashboard.resultNoteTitle")}</AlertTitle>
            <AlertDescription>
              {t("dashboard.resultNoteDescription")}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
