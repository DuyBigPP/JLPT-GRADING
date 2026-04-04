import { ModeToggle } from "@/components/ui/mode-toggle"
import { useTheme } from "@/components/ui/theme-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SEO } from "@/components/common/SEO"

export default function SettingsPage() {
  const { theme } = useTheme()
  const themeLabel: Record<"light" | "dark" | "system", string> = {
  light: "Sáng",
  dark: "Tối",
  system: "Theo hệ thống",
  }

  return (
    <div className="space-y-6">
      <SEO title="Cài đặt" description="Tùy chỉnh giao diện ứng dụng chấm điểm JLPT." path="/settings" />
      <div>
        <h1 className="text-2xl font-bold">Cài đặt</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Giao diện</CardTitle>
          <CardDescription>
            Tùy chỉnh giao diện ứng dụng chấm điểm JLPT.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Chủ đề</p>
            <p className="text-sm text-muted-foreground">
              Chọn giao diện sáng, tối hoặc tự động theo hệ thống.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground capitalize">
              {themeLabel[theme]}
            </span>
            <ModeToggle />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
