"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"

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

function Logo({ href }: { href: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 focus-visible:outline-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-blue-600 bg-white shadow-sm">
        <span className="text-sm font-black text-blue-600">IV</span>
      </div>
      <span className="text-lg font-bold leading-none">IntelVis</span>
    </Link>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { user, isLoading, logout } = useAuth()
  
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const isAuthed = isMounted && !!user;
  const navLinks = isAuthed ? dashboardNavLinks : publicNavLinks;
  const logoHref = isAuthed ? "/dashboard" : "/";

  const renderAuthSection = (isMobile: boolean = false) => {
    if (!isMounted) {
      return isMobile ? null : <div className="h-9 w-[150px]" />;
    }
    
   if (isLoading) {
      return <div className="h-9 w-[150px] bg-gray-800 rounded-md animate-pulse" />;
    }
    
    if (user) {
      return isMobile ? (
        <>
          <div className="rounded-lg bg-muted p-4"><p className="text-sm font-medium">{user.email}</p></div>
          <Button variant="outline" className="w-full" onClick={() => { logout(); setOpen(false); }}>Logout</Button>
        </>
      ) : (
        <>
          <span className="hidden text-sm text-foreground/70 sm:inline">{user.email}</span>
          <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
        </>
      );
    }

    return isMobile ? (
      <>
        <Button variant="outline" className="w-full" asChild onClick={() => setOpen(false)}><Link href="/login">Login</Link></Button>
        <Button className="w-full" asChild onClick={() => setOpen(false)}><Link href="/register">Start Free Trial</Link></Button>
      </>
    ) : (
      <>
        <Button variant="ghost" size="sm" asChild><Link href="/login">Login</Link></Button>
        <Button size="sm" asChild className="px-5"><Link href="/register">Start Free Trial</Link></Button>
      </>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center px-4">
        <Logo href={logoHref} />
        <nav className="ml-8 hidden items-center gap-6 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className={cn("text-sm font-medium transition-colors", pathname === href ? "text-foreground" : "text-foreground/70 hover:text-foreground")}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          {renderAuthSection()}

          {/* --- THE FIX IS HERE --- */}
          {/* We only render the mobile sheet component AFTER the page has mounted on the client */}
          {isMounted && (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /><span className="sr-only">Toggle menu</span></Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <Logo href={logoHref} />
                <nav className="mt-6 flex flex-col gap-4">
                  {navLinks.map(({ href, label }) => (
                    <Link key={href} href={href} onClick={() => setOpen(false)} className={cn("border-b py-2 text-base font-medium", pathname === href ? "text-foreground" : "text-foreground/70 hover:text-foreground")}>
                      {label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-8 space-y-3">
                  {renderAuthSection(true)}
                </div>
              </SheetContent>
            </Sheet>
          )}
          {/* --- END OF FIX --- */}
        </div>
      </div>
    </header>
  );
}