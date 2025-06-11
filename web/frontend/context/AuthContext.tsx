// frontend/context/AuthContext.tsx - FINAL & CORRECTED
"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

// Define the shape of the user object
interface User {
  id: string
  email: string
  createdAt: string
}

// Define the shape of the context value
interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (userData: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Get the API URL from the environment variable provided at build time.
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!API_URL) {
        setIsLoading(false);
        return;
      }
      try {
        // FIX: Add `credentials: 'include'` to send the auth cookie.
        const response = await fetch(`${API_URL}/api/auth/me`, {
          credentials: 'include'
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to check user status:", error);
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
      // FIX: Add `credentials: 'include'` to ensure the correct session is logged out.
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: 'include'
      });
    } finally {
      setUser(null);
      // Redirect to login page after logging out
      router.push("/login");
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}