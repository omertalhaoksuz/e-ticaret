"use client"

import Link from "next/link"
import { ShoppingCart, ChevronDown } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { getCartItems } from "@/services/cart"
import ProductDetailModal from "@/components/ProductDetailModal"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function Header() {
  const { user, token, logout } = useAuth()
  const isLoggedIn = !!user
  const isAdmin = user?.role === "Admin"

  const [cartCount, setCartCount] = useState(0)
  const [menus, setMenus] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  useEffect(() => {
    if (!token) return
    getCartItems(token)
      .then((items) => setCartCount(items.length))
      .catch(() => setCartCount(0))
  }, [token])

  useEffect(() => {
    fetch(`${API_URL}/api/Menu`)
      .then((res) => res.json())
      .then((data) => setMenus(data))
      .catch((err) => console.error("Menu fetch failed:", err))
  }, [])

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">3D Print Hub</Link>

            {isAdmin && (
              <Link href="/admin">
                <Button variant="ghost">Dashboard</Button>
              </Link>
            )}

            <nav className="hidden md:flex items-center space-x-4">
              {menus.map((menu) => (
                <DropdownMenu key={menu.id}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-1">
                      {menu.name}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[200px]">
                    <Link href={`/menu/${menu.id}`}>
                      <DropdownMenuItem className="font-semibold">All {menu.name}</DropdownMenuItem>
                    </Link>
                    {menu.products?.map((product: any) => (
                      <DropdownMenuItem key={product.id} onClick={() => setSelectedProduct(product)}>
                        {product.name}
                      </DropdownMenuItem>
                    ))}
                    {menu.subMenus?.map((sub: any) => (
                      <DropdownMenu key={sub.id}>
                        <DropdownMenuTrigger asChild>
                          <DropdownMenuItem className="flex justify-between items-center">
                            {sub.name}
                            <ChevronDown className="h-3 w-3 ml-2" />
                          </DropdownMenuItem>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start">
                          <DropdownMenuItem asChild className="font-semibold">
                            <Link href={`/submenu/${sub.id}`}>All {sub.name}</Link>
                          </DropdownMenuItem>
                          {sub.products?.length > 0 ? (
                            sub.products.map((product: any) => (
                              <DropdownMenuItem key={product.id} onClick={() => setSelectedProduct(product)}>
                                {product.name}
                              </DropdownMenuItem>
                            ))
                          ) : (
                            <DropdownMenuItem disabled>No items</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative">
                      <Avatar>
                        <AvatarFallback>{user?.email?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
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
                    <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link href="/cart">
                  <Button variant="ghost" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {cartCount}
                      </span>
                    )}
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

      {/* Modal */}
      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </header>
  )
}
