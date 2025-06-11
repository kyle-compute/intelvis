// frontend/app/dashboard/page.tsx - THE FINAL & CORRECTED VERSION
"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Device {
  id: string;
  alias: string | null;
  status: string;
  nic: { mac: string } | null;
}

export default function DashboardPage() {
  const { user, isLoading: authIsLoading, logout } = useAuth()
  const [devices, setDevices] = useState<Device[]>([])
  const [macAddress, setMacAddress] = useState("")
  const [isPairing, setIsPairing] = useState(false)
  const [isFetchingDevices, setIsFetchingDevices] = useState(true)

  useEffect(() => {
    const fetchDevices = async () => {
      if (authIsLoading || !user) {
        if (!authIsLoading) setIsFetchingDevices(false);
        return;
      }
      setIsFetchingDevices(true);
      try {
        // THIS IS THE FIX: Tell the browser to send the auth cookie.
        const response = await fetch(`${API_URL}/api/devices`, {
          credentials: 'include'
        });
        if (response.ok) {
          setDevices(await response.json());
        } else if (response.status === 401) {
          toast.error("Session expired. Please log in.");
          logout();
        } else {
          toast.error("Failed to fetch devices.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching devices.");
      } finally {
        setIsFetchingDevices(false);
      }
    };
    fetchDevices();
  }, [user, authIsLoading, logout]);

  const handlePairDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!macAddress) {
      toast.error("MAC Address cannot be empty.");
      return;
    }
    setIsPairing(true);
    try {
      // THIS IS THE FIX: Tell the browser to send the auth cookie.
      const response = await fetch(`${API_URL}/api/devices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mac: macAddress }),
        credentials: 'include'
      });
      const newDevice = await response.json();
      if (response.ok) {
        toast.success("Device paired successfully!");
        setDevices(prevDevices => [...prevDevices, newDevice]);
        setMacAddress("");
      } else if (response.status === 401) {
        toast.error("Session expired. Please log in.");
        logout();
      } else {
        toast.error(newDevice.message || "Failed to pair device.");
      }
    } catch (error) {
      toast.error("An error occurred during pairing.");
    } finally {
      setIsPairing(false);
    }
  };

  if (authIsLoading) {
    return <div className="p-8 text-center">Authenticating...</div>;
  }
  if (!user) {
    // This will briefly show before the context redirects
    return <div className="p-8 text-center">Redirecting to login...</div>;
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      {/* ... The rest of your JSX remains the same ... */}
    </div>
  );
}