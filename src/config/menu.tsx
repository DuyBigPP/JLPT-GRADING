import React from "react"
import { Calculator, Home, Settings} from "lucide-react"

export type MenuItem = {
  label: string
  path: string
  icon: React.ReactNode
  // Optional children for submenus
  children?: MenuItem[]
}

export const menuItems: MenuItem[] = [
  { label: "Trang chủ", path: "/dashboard", icon: <Home size={16} /> },
  { label: "Chấm điểm JLPT", path: "/grading", icon: <Calculator size={16} /> },
  { label: "Settings", path: "/settings", icon: <Settings size={16} /> },

  // {
  //   label: "Menu1",
  //   path: "/menu1",
  //   icon: <List size={16} />,
  //   children: [
  //     { label: "Submenu1", path: "/menu1/submenu1", icon: <ChevronRight size={16} /> },
  //     { label: "Submenu2", path: "/menu1/submenu2", icon: <ChevronRight size={16} /> },
  //   ],
  // },
]