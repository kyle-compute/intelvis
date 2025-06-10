"use client"
import { useAuth } from "@/context/AuthContext"
import { AddDeviceForm } from "@/components/ui/AddDeviceForm" 

export default function DashboardPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div> // Show a loading state
  }

  if (!user) {
    // This can happen briefly on load; you might redirect or show a login prompt
    return <div>Please log in to see your dashboard.</div>
  }

  return (
    <main className="container mx-auto p-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user.email}</h1>
        <p className="text-muted-foreground">Your device dashboard.</p>
      </div>

      {/* 2. REPLACE the placeholder with the actual component */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AddDeviceForm />

        <div className="lg:col-span-2">
            {/* This is where your device list will go next */}
        </div>
      </div>
    </main>
  )
}