import { ModeToggle } from "@/components/ui/mode-toggle"
import { useTheme } from "@/components/ui/theme-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SEO } from "@/components/common/SEO"

export default function SettingsPage() {
  const { theme } = useTheme()

  return (
    <div className="space-y-6">
      <SEO title="Cài đặt" description="Tùy chỉnh giao diện ứng dụng chấm điểm JLPT." path="/settings" />
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize how the app looks on your device
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Theme</p>
            <p className="text-sm text-muted-foreground">
              Select your preferred theme for the application
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground capitalize">
              {theme}
            </span>
            <ModeToggle />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
