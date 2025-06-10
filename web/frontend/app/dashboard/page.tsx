"use client"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { AddDeviceForm } from "@/components/ui/AddDeviceForm"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface Device {
  id: string;
  alias: string | null;
  status: string;
  nic: {
    mac: string;
  };
  createdAt: string;
}

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [devices, setDevices] = useState<Device[]>([])
  const [isDeviceLoading, setIsDeviceLoading] = useState(true)

  useEffect(() => {
    if (user) {
      const fetchDevices = async () => {
        setIsDeviceLoading(true);
        try {
          const response = await fetch("/api/devices");
          if (!response.ok) throw new Error("Failed to fetch devices");
          const data: Device[] = await response.json();
          setDevices(data);
        } catch (error) {
          console.error(error);
          toast.error("Could not load your devices.");
        } finally {
          setIsDeviceLoading(false);
        }
      };
      fetchDevices();
    } else if (!isAuthLoading) {
        setIsDeviceLoading(false);
    }
  }, [user, isAuthLoading]);

  // This function adds the new device to the state, forcing a re-render.
  const handleDeviceAdded = (newDevice: Device) => {
    setDevices(prevDevices => [newDevice, ...prevDevices]);
  };

  if (isAuthLoading) {
    return <div className="container p-4">Loading user session...</div>
  }

  if (!user) {
    return <div className="container p-4">Please log in to view your dashboard.</div>
  }

  return (
    <main className="container mx-auto p-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user.email}</h1>
        <p className="text-muted-foreground">Your device dashboard.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          {/* --- THE FIX: Pass the callback function to the form component --- */}
          <AddDeviceForm onDeviceAdded={handleDeviceAdded} />
        </div>
        
        <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Your Devices</h2>
            {isDeviceLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading devices...</span>
                </div>
            ) : devices.length > 0 ? (
                <div className="space-y-4">
                    {devices.map((device) => (
                        <Card key={device.id}>
                            <CardHeader>
                                <CardTitle>{device.alias || `Device`}</CardTitle>
                                {/* Use optional chaining for safety */}
                                <CardDescription>MAC: {device.nic?.mac || 'N/A'}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">Status: <span className="font-medium text-green-400">{device.status}</span></p>
                                <p className="text-sm text-muted-foreground">Paired: {new Date(device.createdAt).toLocaleDateString()}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground">You have no devices yet. Add one to get started.</p>
            )}
        </div>
      </div>
    </main>
  );
}