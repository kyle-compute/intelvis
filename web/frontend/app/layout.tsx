import "./globals.css"
import { ReactNode } from "react"
import { Navbar } from "@/components/ui/navbar"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
        <Navbar />
        <div className="pt-16">{children}</div>
      </body>
    </html>
  )
}
