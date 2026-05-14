import type React from "react"
import { useLocation, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ChevronRight } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { menuItems } from "@/config/menu"

interface BreadcrumbItem {
  label: string
  path: string
  icon?: React.ReactNode
}

export function BreadcrumbHeader() {
  const { t } = useTranslation()
  const location = useLocation()
  const breadcrumbs = generateBreadcrumbs(location.pathname, t)

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center border-b border-border bg-background/95 px-4 backdrop-blur lg:px-6">
      <div className="flex h-full items-center gap-3">
        <SidebarTrigger />
        <div data-orientation="vertical" className="shrink-0 bg-border w-[1px] h-4"></div>

        <nav className="flex items-center text-sm">
          <ol className="flex items-center gap-1">
            {breadcrumbs.map((item, index) => (
              <li key={item.path} className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                {index === breadcrumbs.length - 1 ? (
                  <span className="flex h-9 items-center gap-1.5 rounded-md px-2 font-medium text-foreground">
                    {item.icon}
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.path}
                    className="flex h-9 items-center gap-1.5 rounded-md px-2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.icon}
                    <span className="hidden md:inline">{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </header>
  )
}

function generateBreadcrumbs(pathname: string, t: (key: string) => string): BreadcrumbItem[] {
  const paths = pathname.split("/").filter(Boolean)
  if (paths.length === 0) return []

  const breadcrumbs: BreadcrumbItem[] = []
  let currentPath = ""
  const processedPaths = new Set<string>()

  paths.forEach((segment) => {
    currentPath += `/${segment}`

    if (processedPaths.has(currentPath)) {
      return
    }

    processedPaths.add(currentPath)

    const menuItem = findMenuItemByPath(currentPath)
    if (menuItem) {
      breadcrumbs.push({
        label: t(menuItem.labelKey),
        path: menuItem.path,
        icon: menuItem.icon,
      })
    } else {
      breadcrumbs.push({
        label: formatBreadcrumbLabel(segment),
        path: currentPath,
      })
    }
  })

  return breadcrumbs
}

function findMenuItemByPath(path: string) {
  return menuItems.find((item) => item.path === path)
}

function formatBreadcrumbLabel(segment: string): string {
  return segment
    .replace(/-/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}
