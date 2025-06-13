"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"

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
  const [open, setOpen] = useState(false)
  const { user, isLoading, logout } = useAuth()
  
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const logoHref = "/";

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
        <Button className="w-full" asChild onClick={() => setOpen(false)}><Link href="#early-access-form">Request Demo</Link></Button>
      </>
    ) : (
      <>
        <Button variant="ghost" size="sm" asChild><Link href="/login">Login</Link></Button>
        <Button size="sm" asChild className="px-5"><Link href="#early-access-form">Request Demo</Link></Button>
      </>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center px-4">
        <Logo href={logoHref} />

        {isMounted && user && (
          <nav className="ml-auto mr-4 hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/analytics" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
              Analytics
            </Link>
          </nav>
        )}
        
        <div className={isMounted && user ? "flex items-center gap-4" : "ml-auto flex items-center gap-4"}>
          {renderAuthSection()}

          {isMounted && (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /><span className="sr-only">Toggle menu</span></Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <Logo href={logoHref} />
                <div className="mt-8 space-y-3">
                  {user && (
                    <>
                      <Link href="/dashboard" className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted" onClick={() => setOpen(false)}>
                        Dashboard
                      </Link>
                      <Link href="/analytics" className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted" onClick={() => setOpen(false)}>
                        Analytics
                      </Link>
                      <div className="border-t border-border my-3"></div>
                    </>
                  )}
                  {renderAuthSection(true)}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}