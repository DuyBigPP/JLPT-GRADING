import { useTranslation } from "react-i18next"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { useTheme } from "@/components/ui/theme-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SEO } from "@/components/common/SEO"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function SettingsPage() {
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()

  const themeLabel: Record<"light" | "dark" | "system", string> = {
    light: t("settings.themeLight"),
    dark: t("settings.themeDark"),
    system: t("settings.themeSystem"),
  }

  const changeLanguage = (lng: string) => {
    if (lng) {
      i18n.changeLanguage(lng)
    }
  }

  return (
    <div className="space-y-6">
      <SEO title={t("settings.seoTitle")} description={t("settings.seoDescription")} path="/settings" noIndex />
      <div>
        <h1 className="text-2xl font-bold">{t("settings.title")}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.interface")}</CardTitle>
          <CardDescription>
            {t("settings.interfaceDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">{t("settings.theme")}</p>
              <p className="text-sm text-muted-foreground">
                {t("settings.themeDescription")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground capitalize">
                {themeLabel[theme]}
              </span>
              <ModeToggle />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">{t("settings.language")}</p>
              <p className="text-sm text-muted-foreground">
                {t("settings.languageDescription")}
              </p>
            </div>
            <ToggleGroup
              type="single"
              value={i18n.language}
              onValueChange={changeLanguage}
              variant="outline"
            >
              <ToggleGroupItem value="vi" className="px-3 text-sm">
                {t("settings.languageVi")}
              </ToggleGroupItem>
              <ToggleGroupItem value="en" className="px-3 text-sm">
                {t("settings.languageEn")}
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
