// frontend/context/AuthContext.tsx
"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
}

interface AuthContextShape {
  user: User | null
  isLoading: boolean
  isAuthCheckComplete: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextShape | null>(null)

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "" // e.g. https://api.intelvis.ai

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false)
  const router = useRouter()

  // 1. Initial session check ------------------------------------------------------------------
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          credentials: "include",
        })
        if (res.ok) setUser(await res.json())
        else setUser(null)
      } catch {
        setUser(null)
      } finally {
        setIsAuthCheckComplete(true)
      }
    })()
  }, [])

  // 2. Login ----------------------------------------------------------------------------------
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // critical – stores authToken cookie
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) throw new Error("invalid-credentials")
      const data = (await res.json()) as User
      setUser(data)
      router.replace("/dashboard")
    } finally {
      setIsLoading(false)
    }
  }

  // 3. Logout ---------------------------------------------------------------------------------
  const logout = async () => {
    setIsLoading(true)
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      })
    } finally {
      setUser(null)
      setIsLoading(false)
      router.replace("/login")
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthCheckComplete, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// 4. Consumer hook ----------------------------------------------------------------------------
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
  return ctx
}
