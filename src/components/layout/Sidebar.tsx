import React from "react"
import { useLocation, Link } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"
import { menuItems } from "@/config/menu"
import { LucideLayoutDashboard, ChevronRight } from "lucide-react"

export function AdminSidebar() {
  const location = useLocation()
  // State to control which menu with children is open 
  const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null)

  const toggleSubmenu = (path: string) => {
    setOpenSubmenu((prev) => (prev === path ? null : path))
  }

  return (
    <Sidebar
      side="left"
      variant="sidebar"
      collapsible="offcanvas"
      className="border-r border-border"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LucideLayoutDashboard className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Chấm điểm JLPT</span>
          </div>
        </div>
      </SidebarHeader>
      {/* <SidebarSeparator /> */}
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => {
            if (item.children) {
              return (
                <SidebarMenuItem key={item.path}>
                  <div>
                    <SidebarMenuButton
                      onClick={() => toggleSubmenu(item.path)}
                      // Check if pathname starts with this item's path (to include children)
                      isActive={location.pathname.startsWith(item.path)}
                      tooltip={item.label}
                      className="flex justify-between items-center transition-colors hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent/50 data-[active=true]:font-medium"
                    >
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight
                        size={16}
                        className={`transition-transform duration-200 ${openSubmenu === item.path ? "rotate-90" : ""}`}
                      />
                    </SidebarMenuButton>
                    {openSubmenu === item.path && (
                      <ul className="mt-1 pl-4 transition-all duration-200 ease-out">
                        {item.children.map((child) => (
                          <li key={child.path}>
                            <SidebarMenuButton
                              asChild
                              isActive={location.pathname === child.path}
                              tooltip={child.label}
                              className="transition-colors hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent/50 data-[active=true]:font-medium text-sm"
                            >
                              <Link to={child.path}>
                                {child.icon}
                                <span>{child.label}</span>
                              </Link>
                            </SidebarMenuButton>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </SidebarMenuItem>
              )
            }
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.path}
                  tooltip={item.label}
                  className="transition-colors hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent/50 data-[active=true]:font-medium"
                >
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      {/* <SidebarFooter className="mt-auto border-t border-border p-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Admin User</span>
            <span className="text-xs text-muted-foreground">admin@example.com</span>
          </div>
        </div>
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  )
}