// frontend/app/dashboard/page.tsx

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Loader2 } from "lucide-react"

// We will build this component next
// import { AddDeviceForm } from "@/components/add-device-form"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // This effect handles redirection
  useEffect(() => {
    // If loading is finished and there's no user, redirect to login
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  // Show a loading spinner while we check the user's session
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // If there's a user, render the dashboard content
  if (user) {
    return (
      <main className="container py-8">
        <h1 className="text-3xl font-bold">Welcome, {user.email}</h1>
        <p className="text-muted-foreground">Your device dashboard.</p>
        
        <div className="mt-8">
          {/* This is where we'll put the form to add a new device */}
          {/* <AddDeviceForm /> */}
          <h2 className="text-xl font-semibold mt-6">Add a Device</h2>
          <p>This is where the 'Add Device' form will go.</p>
        </div>

        <div className="mt-8">
          {/* This is where we'll list the user's devices */}
          <h2 className="text-xl font-semibold mt-6">Your Devices</h2>
          <p>This is where the list of devices will be displayed.</p>
        </div>
      </main>
    )
  }

  // This will be shown briefly before the redirect happens
  return null
}