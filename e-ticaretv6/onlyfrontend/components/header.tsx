"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, ChevronDown } from "lucide-react"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mock data - would come from API in real app
const categories = [
  {
    id: 1,
    name: "3D Printers",
    products: [
      { id: 1, name: "Ender 3 Pro" },
      { id: 2, name: "Prusa i3 MK3S+" },
    ],
  },
  {
    id: 2,
    name: "Filaments",
    products: [
      { id: 3, name: "PLA Filament" },
      { id: 4, name: "ABS Filament" },
    ],
  },
  {
    id: 3,
    name: "Accessories",
    products: [
      { id: 5, name: "Nozzle Set" },
      { id: 6, name: "Build Plate" },
    ],
  },
  {
    id: 4,
    name: "Software",
    products: [
      { id: 7, name: "Slicing Software" },
      { id: 8, name: "3D Modeling Tools" },
    ],
  },
  {
    id: 5,
    name: "Services",
    products: [
      { id: 9, name: "3D Printing Service" },
      { id: 10, name: "3D Modeling Service" },
    ],
  },
]

export default function Header() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  // Toggle login status for demo purposes
  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn)
  }

  // Toggle admin status for demo purposes
  const toggleAdmin = () => {
    setIsAdmin(!isAdmin)
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {/* Home button */}
            <Link href="/" className="text-xl font-bold">
              3D Print Hub
            </Link>

            {/* Dashboard button (admin only) */}
            {isAdmin && (
              <Link href="/admin">
                <Button variant="ghost">Dashboard</Button>
              </Link>
            )}

            {/* Category dropdown menus */}
            <nav className="hidden md:flex items-center space-x-4">
              {categories.map((category) => (
                <DropdownMenu key={category.id}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-1">
                      {category.name}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <Link href={`/category/${category.id}`} className="w-full">
                      <Button variant="ghost" className="w-full justify-start">
                        All {category.name}
                      </Button>
                    </Link>
                    {category.products.map((product) => (
                      <DropdownMenuItem key={product.id} asChild>
                        <Link href={`/product/${product.id}`}>{product.name}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </nav>
          </div>

          {/* User authentication */}
          <div className="flex items-center space-x-4">
            {/* Demo toggles - remove in production */}
            <div className="flex items-center space-x-2 mr-4">
              <Button variant="outline" size="sm" onClick={toggleLogin}>
                Toggle Login
              </Button>
              <Button variant="outline" size="sm" onClick={toggleAdmin}>
                Toggle Admin
              </Button>
            </div>

            {isLoggedIn ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative">
                      <Avatar>
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders">My Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link href="/cart">
                  <Button variant="ghost" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      3
                    </span>
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button variant="default">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
