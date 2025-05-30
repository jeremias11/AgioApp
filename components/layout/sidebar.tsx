"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Receipt, Users, Settings, Menu, X, DollarSign, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Contratos",
      icon: FileText,
      href: "/contracts",
      active: pathname === "/contracts",
    },
    {
      label: "Recebimentos",
      icon: Receipt,
      href: "/receipts",
      active: pathname === "/receipts",
    },
    {
      label: "Clientes",
      icon: Users,
      href: "/clients",
      active: pathname === "/clients",
    },
    {
      label: "Relatórios",
      icon: BarChart3,
      href: "/reports",
      active: pathname === "/reports",
    },
    {
      label: "Configurações",
      icon: Settings,
      href: "/settings",
      active: pathname === "/settings",
    },
  ]

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)} className="rounded-full">
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r shadow-sm transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <div className="flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold">LoanManager</span>
            </div>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="flex flex-col gap-1 px-2">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-gray-100",
                    route.active ? "bg-gray-100 text-green-600" : "text-gray-500",
                  )}
                >
                  <route.icon className={cn("h-5 w-5", route.active && "text-green-600")} />
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="rounded-full bg-gray-100 p-1">
                <Users className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Administrador</p>
                <p className="text-xs text-gray-500">admin@loanmanager.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
