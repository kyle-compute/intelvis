// frontend/context/AuthContext.tsx - THE FINAL, CORRECTED VERSION
"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"

// Note: No longer need useRouter here as we use window for redirects
// to break the race condition.

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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Invalid credentials");
      }
      
      // On success, we don't even need to parse the user data.
      // We force a hard reload to the dashboard. The AuthContext's
      // initial useEffect will then run on a fresh page and fetch the user.
      // This completely breaks the race condition.
      window.location.replace("/dashboard");

    } finally {
      // In the success case, the page reloads so this is never hit.
      // It will only be hit on failure.
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
      // A hard redirect is also more robust for logout.
      window.location.replace("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthCheckComplete, login, logout }}
    >
      {isAuthCheckComplete ? children : null /* Or a loading spinner */}
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