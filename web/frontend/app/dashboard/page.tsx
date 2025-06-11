// frontend/app/dashboard/page.tsx - THE FINAL, COMPLETE, AND CORRECTED VERSION
"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation" // Import useRouter for the redirect

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Device {
  id: string;
  alias: string | null;
  status: string;
  nic: { mac: string } | null;
}

export default function DashboardPage() {
  const { user, isAuthCheckComplete, logout } = useAuth()
  const router = useRouter() // Get the router instance
  const [devices, setDevices] = useState<Device[]>([])
  const [macAddress, setMacAddress] = useState("")
  const [isPairing, setIsPairing] = useState(false)
  const [isFetchingDevices, setIsFetchingDevices] = useState(true)

  // This effect handles fetching devices ONLY when the user is confirmed.
  useEffect(() => {
    const fetchDevices = async () => {
      // Only proceed if the auth check is done AND we have a user.
      if (isAuthCheckComplete && user) {
        setIsFetchingDevices(true);
        try {
          const response = await fetch(`${API_URL}/api/devices`, { credentials: 'include' });
          if (response.ok) {
            setDevices(await response.json());
          } else {
            // If this fails, the token is likely invalid. Logout.
            toast.error("Session expired. Please log in again.");
            logout(); // The logout function in AuthContext should handle the redirect.
          }
        } catch (error) {
          console.error("Error fetching devices:", error);
          toast.error("An error occurred while fetching devices.");
        } finally {
          setIsFetchingDevices(false);
        }
      }
    };

    fetchDevices();
  }, [user, isAuthCheckComplete, logout]); // Dependency array is correct.

  // This effect handles REDIRECTION when auth state is confirmed.
  useEffect(() => {
    // If the check is complete and there's still no user, redirect to login.
    if (isAuthCheckComplete && !user) {
      router.push('/login');
    }
  }, [user, isAuthCheckComplete, router]);

  // --- THIS IS THE CRITICAL RENDERING LOGIC FIX ---

  // 1. While the auth check is running, show a full-page loader.
  if (!isAuthCheckComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // 2. If the check is done and there's NO user, render the redirect message or null.
  // The useEffect above will handle the actual redirect.
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  // 3. If the check is done AND there IS a user, render the dashboard.
  const handlePairDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    // ... (rest of the handlePairDevice function remains the same)
    if (!macAddress) {
      toast.error("MAC Address cannot be empty.");
      return;
    }
    setIsPairing(true);
    try {
      const response = await fetch(`${API_URL}/api/devices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mac: macAddress }),
        credentials: 'include'
      });
      const newDevice = await response.json();
      if (response.ok) {
        toast.success("Device paired successfully!");
        setDevices(prev => [...prev, newDevice]);
        setMacAddress('');
      } else if (response.status === 401) {
        toast.error("Your session has expired. Please log in again.");
        logout();
      } else {
        toast.error(newDevice.message || 'Failed to pair device.');
      }
    } catch (error) {
      console.error("An error occurred during pairing:", error);
      toast.error("An error occurred during pairing.");
    } finally {
      setIsPairing(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user.email}</h1>
      <p className="text-gray-400 mb-8">Your device dashboard.</p>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add a Device</h2>
            <p className="text-sm text-gray-500 mb-4">Enter the MAC Address found on your device.</p>
            <form onSubmit={handlePairDevice}>
              <label htmlFor="mac" className="block text-sm font-medium mb-2 text-gray-400">MAC Address</label>
              <input
                id="mac"
                type="text"
                value={macAddress}
                onChange={(e) => setMacAddress(e.target.value)}
                placeholder="AA:BB:CC:DD:EE:FF"
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={isPairing}
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 transition-colors flex items-center justify-center disabled:bg-gray-600"
                disabled={isPairing}
              >
                {isPairing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Pair Device
              </button>
            </form>
          </div>
        </div>
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Your Devices</h2>
          {isFetchingDevices ? (
            <div className="text-center text-gray-500">
              <Loader2 className="h-6 w-6 animate-spin inline-block" />
              <p>Loading devices...</p>
            </div>
          ) : devices.length > 0 ? (
            <div className="space-y-4">
              {devices.map(device => (
                <div key={device.id} className="bg-gray-900 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-bold">{device.alias || `Device ${device.id.slice(-6)}`}</p>
                    <p className="text-sm text-gray-400">{device.nic?.mac}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${device.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {device.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You have no devices yet. Add one to get started.</p>
          )}
        </div>
      </div>
    </div>
  );
}