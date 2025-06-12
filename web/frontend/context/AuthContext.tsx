// frontend/context/AuthContext.tsx - THIS IS THE ONLY CORRECT VERSION
"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"

interface User {
  id: string
  email: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthCheckComplete: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include",
        })
        if (res.ok) {
          setUser(await res.json())
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      } finally {
        setIsAuthCheckComplete(true)
      }
    }
    checkSession()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // <-- THE FIX IS HERE
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Invalid credentials");
      }
      
      window.location.replace("/dashboard");

    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
      setIsLoading(false);
      window.location.replace("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthCheckComplete, login, logout }}
    >
      {isAuthCheckComplete ? children : <div className="flex items-center justify-center min-h-screen">Loading Application...</div>}
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