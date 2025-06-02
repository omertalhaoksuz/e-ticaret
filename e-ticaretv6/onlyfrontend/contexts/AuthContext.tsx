"use client"

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"
import { jwtDecode } from "jwt-decode"

interface User {
  email: string
  role: string
  [key: string]: any
}

interface AuthContextType {
  token: string | null
  user: User | null
  setToken: (token: string | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setTokenFromValue(storedToken)
    }
  }, [])

  const setTokenFromValue = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken)
      setTokenState(newToken)
      try {
        const decoded: any = jwtDecode(newToken)
        const role =
          decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
        setUser({ ...decoded, role })
      } catch {
        setUser(null)
      }
    } else {
      localStorage.removeItem("token")
      setTokenState(null)
      setUser(null)
    }
  }

  const setToken = (newToken: string | null) => {
    setTokenFromValue(newToken)
  }

  const logout = () => setToken(null)

  return (
    <AuthContext.Provider value={{ token, user, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
