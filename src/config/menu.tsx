import React from "react"
import { Calculator, Home, Settings } from "lucide-react"

export type MenuItem = {
  labelKey: string
  path: string
  icon: React.ReactNode
  children?: MenuItem[]
}

export const menuItems: MenuItem[] = [
  { labelKey: "menu.home", path: "/dashboard", icon: <Home size={16} /> },
  { labelKey: "menu.grading", path: "/grading", icon: <Calculator size={16} /> },
  { labelKey: "menu.settings", path: "/settings", icon: <Settings size={16} /> },
]
