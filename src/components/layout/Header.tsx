import type React from "react"
import { useLocation, Link } from "react-router-dom"
import { ChevronRight} from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { menuItems } from "@/config/menu"

interface BreadcrumbItem {
  label: string
  path: string
  icon?: React.ReactNode
}

export function BreadcrumbHeader() {
  const location = useLocation()
  const breadcrumbs = generateBreadcrumbs(location.pathname)

  return (
    <header className="flex h-14 items-center bg-background px-4 lg:px-6 border-b border-border shrink-0">
      <div className="flex h-full items-center gap-3">
        <SidebarTrigger />
        <div data-orientation="vertical" className="shrink-0 bg-border w-[1px] h-4"></div>

        <nav className="flex items-center text-sm">
          <ol className="flex items-center gap-1">
            {/* <li>
              <Link
                to="/"
                className="flex h-9 items-center gap-1.5 rounded-md px-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Home className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only sm:inline">Home</span>
              </Link>
            </li> */}

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

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  // Split the pathname into segments
  const paths = pathname.split("/").filter(Boolean)
  if (paths.length === 0) return []

  const breadcrumbs: BreadcrumbItem[] = []
  let currentPath = ""
  
  // Lưu trữ đường dẫn đã xử lý để tránh lặp lại item
  const processedPaths = new Set<string>()

  paths.forEach((segment) => {
    currentPath += `/${segment}`
    
    // Bỏ qua nếu đường dẫn này đã được xử lý
    if (processedPaths.has(currentPath)) {
      return
    }
    
    // Đánh dấu đường dẫn đã được xử lý
    processedPaths.add(currentPath)

    // Find matching menu item
    const menuItem = findMenuItemByPath(currentPath)
    if (menuItem) {
      // Nếu đây là menu cha có children, thêm vào với đúng đường dẫn của nó
      // mà không tự động chuyển hướng đến submenu đầu tiên
      breadcrumbs.push({
        label: menuItem.label,
        path: menuItem.path,
        icon: menuItem.icon,
      })
    } else {
      // For paths not defined in the menu, create a formatted label.
      breadcrumbs.push({
        label: formatBreadcrumbLabel(segment),
        path: currentPath,
      })
    }
  })

  return breadcrumbs
}

function findMenuItemByPath(path: string) {
  // Search through the menu items for a matching path.
  return menuItems.find((item) => item.path === path)
}

function formatBreadcrumbLabel(segment: string): string {
  // Convert kebab-case or camelCase to Title Case with spaces.
  return segment
    .replace(/-/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}