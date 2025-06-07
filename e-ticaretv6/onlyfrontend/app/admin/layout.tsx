"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, Palette, FileText, ChevronRight, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface SidebarNavProps {
  isCollapsed: boolean
  links: {
    title: string
    label?: string
    icon: React.ComponentType<{ className?: string }>
    variant: "default" | "ghost"
    href: string
  }[]
}

function SidebarNav({ links, isCollapsed }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <div data-collapsed={isCollapsed} className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => {
          const isActive = pathname === link.href

          return (
            <Link
              key={index}
              href={link.href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <link.icon className="h-4 w-4" />
              {!isCollapsed && <span>{link.title}</span>}
              {!isCollapsed && link.label && <span className="ml-auto text-xs">{link.label}</span>}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const links: {
    title: string
    icon: React.ComponentType<{ className?: string }>
    variant: "default" | "ghost"
    href: string
  }[] = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      variant: "default",
      href: "/admin",
    },
    {
      title: "Orders",
      icon: ShoppingCart,
      variant: "ghost",
      href: "/admin/orders",
    },
    {
      title: "Products",
      icon: Package,
      variant: "ghost",
      href: "/admin/products",
    },
    {
      title: "Manage Colors",
      icon: Palette,
      variant: "ghost",
      href: "/admin/colors",
    },
    {
      title: "Manage Pages",
      icon: FileText,
      variant: "ghost",
      href: "/admin/pages",
    },
    {
      title: "Menus",
      icon: Menu,
      variant: "ghost",
      href: "/admin/menus",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="md:hidden">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="mr-2">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <div className="px-2 py-6">
                  <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-8">
                    3D Print Hub Admin
                  </Link>
                  <SidebarNav links={links} isCollapsed={false} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="font-bold text-lg">
              3D Print Hub Admin
            </Link>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/">
              <Button variant="outline" size="sm">
                View Site
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-1">
        <aside className={`hidden border-r md:block ${isCollapsed ? "w-[70px]" : "w-[240px]"}`}>
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center justify-between border-b px-4">
              {!isCollapsed && <span className="text-sm font-medium">Navigation</span>}
              <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8">
                <ChevronRight className={`h-4 w-4 transition-transform ${isCollapsed ? "" : "rotate-180"}`} />
              </Button>
            </div>
            <SidebarNav links={links} isCollapsed={isCollapsed} />
          </div>
        </aside>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
