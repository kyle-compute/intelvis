// frontend/app/layout.tsx

import "./globals.css"
import { ReactNode } from "react"
import { AuthProvider } from "@/context/AuthContext" // 1. Import the AuthProvider
import { Navbar } from "@/components/ui/navbar"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="min-h-screen">
        <AuthProvider> {/* 2. Wrap everything inside the body */}
          <Navbar />
          <div className="pt-16">{children}</div>
        </AuthProvider>
      </body>
    </html>
  )
}