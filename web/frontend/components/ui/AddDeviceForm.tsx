"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const formSchema = z.object({
  mac: z.string().regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, {
    message: "Enter a valid MAC address (e.g., AA:BB:CC:DD:EE:FF)",
  }),
})

// --- FIX #1: Define a specific type for the device data ---
// This resolves the "Unexpected any" error.
interface NewDevice {
  id: string;
  alias: string | null;
  status: string;
  nic: {
    mac: string;
  };
  createdAt: string;
}

interface AddDeviceFormProps {
  onDeviceAdded: (device: NewDevice) => void;
}

export function AddDeviceForm({ onDeviceAdded }: AddDeviceFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { mac: "" },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    toast.info("Attempting to pair device...")

    try {
      const response = await fetch("/api/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mac: values.mac }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Device paired successfully!")
        form.reset()
        onDeviceAdded(data);
      } else {
        toast.error(data.message || "Pairing failed.")
      }
    } catch { // --- FIX #2: Removed the unused 'error' variable ---
      toast.error("A network or server error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a Device</CardTitle>
        <CardDescription>Enter the MAC Address found on your device.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="mac"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MAC Address</FormLabel>
                  <FormControl>
                    <Input placeholder="AA:BB:CC:DD:EE:FF" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Pair Device
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}