// components/navbar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Loader2, Menu } from "lucide-react" // <-- Added Loader2
import { useState } from "react"
import { useAuth } from "@/context/AuthContext" // <-- THE KEY IMPORT

// ... (publicNavLinks and dashboardNavLinks are unchanged)
const publicNavLinks = [
  { href: "/features", label: "Features" },
  { href: "/solutions", label: "Solutions" },
  { href: "/pricing", label: "Pricing" },
]

const dashboardNavLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings", label: "Settings" },
]

/* -------------------------------------------------- /
/                     Sub-components                 /
/ -------------------------------------------------- */

function Logo({ href }: { href: string }) {
  // ... (Logo component is unchanged)
  return (
    <Link href={href} className="flex items-center gap-2 focus-visible:outline-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-blue-600 bg-white shadow-sm">
        <span className="text-sm font-black text-blue-600">IV</span>
      </div>
      <span className="text-lg font-bold leading-none">IntelVis</span>
    </Link>
  )
}

/* -------------------------------------------------- /
/                      Navbar                        /
/ -------------------------------------------------- */

// We no longer need to pass any props!
export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { user, isLoading, logout } = useAuth() // <-- GETTING STATE FROM CONTEXT

  const isAuthed = Boolean(user)
  const navLinks = isAuthed ? dashboardNavLinks : publicNavLinks

  const renderAuthButtons = () => {
    if (isLoading) {
      return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    }
    if (isAuthed && user) {
      return (
        <>
          <span className="hidden text-sm text-foreground/70 sm:inline">{user.email}</span>
          {/* This now calls the logout function from context */}
          <Button variant="ghost" size="sm" onClick={logout}>
            Logout
          </Button>
        </>
      )
    }
    return (
      <>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button size="sm" asChild className="px-5">
          {/* Assuming your signup page is /register */}
          <Link href="/register">Start Free Trial</Link>
        </Button>
      </>
    )
  }

  const renderMobileAuth = () => {
    if (isLoading) {
      return <div className="mt-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
    }
    if (isAuthed && user) {
       return (
        <>
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium">{user.email}</p>
            <p className="text-xs text-foreground/60">Logged In</p>
          </div>
          {/* This now calls the logout function from context */}
          <Button variant="outline" className="w-full" onClick={() => { logout(); setOpen(false); }}>
            Logout
          </Button>
        </>
       )
    }
    return (
      <>
        <Button variant="outline" className="w-full" asChild onClick={() => setOpen(false)}>
          <Link href="/login">Login</Link>
        </Button>
        <Button className="w-full" asChild onClick={() => setOpen(false)}>
          <Link href="/register">Start Free Trial</Link>
        </Button>
      </>
    )
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center px-4">
        {/* Logo */}
        <Logo href={isAuthed ? "/dashboard" : "/"} />
        {/* Desktop nav */}
        <nav className="ml-8 hidden items-center gap-6 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-sm font-medium transition-colors focus-visible:outline-2",
                pathname === href ? "text-foreground" : "text-foreground/70 hover:text-foreground"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-4">
          {renderAuthButtons()}

          {/* Mobile menu trigger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-80">
              <Logo href={isAuthed ? "/dashboard" : "/"} />
              <nav className="mt-6 flex flex-col gap-4">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "border-b border-border/50 py-2 text-base font-medium transition-colors focus-visible:outline-2",
                      pathname === href ? "text-foreground" : "text-foreground/70 hover:text-foreground"
                    )}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
              <div className="mt-8 space-y-3">
                {renderMobileAuth()}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}