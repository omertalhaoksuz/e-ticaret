"use client";

import Link from "next/link";
import { ShoppingCart, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { getCartItems } from "@/services/cart";

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
];

export default function Header() {
  const { user, token, logout } = useAuth();
  const isLoggedIn = !!user;
  const isAdmin = user?.role === "Admin";

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (!token) return;

    getCartItems(token)
      .then((items) => setCartCount(items.length))
      .catch(() => setCartCount(0));
  }, [token]);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              3D Print Hub
            </Link>

            {isAdmin && (
              <Link href="/admin">
                <Button variant="ghost">Dashboard</Button>
              </Link>
            )}

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
    </header>
  );
}
