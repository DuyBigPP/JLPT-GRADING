import { Outlet } from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "./Sidebar"
import { BreadcrumbHeader } from "./Header"

export function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-dvh w-full overflow-hidden">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <BreadcrumbHeader />
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <main className="w-full p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

