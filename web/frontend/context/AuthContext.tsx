// frontend/context/AuthContext.tsx - THE FINAL, CORRECTED VERSION
"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (userData: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // THIS IS THE FIX: Tell the browser to send the auth cookie.
        const response = await fetch(`${API_URL}/api/auth/me`, {
          credentials: 'include'
        });
        if (response.ok) {
          setUser(await response.json());
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    checkUserStatus();
  }, [])

  const login = (userData: User) => {
    setUser(userData);
  }

  const logout = async () => {
    try {
      // THIS IS THE FIX: Tell the browser to send the auth cookie for logout.
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: 'include'
      });
    } finally {
      setUser(null);
      router.push("/login");
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}