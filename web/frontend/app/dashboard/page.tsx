// frontend/app/dashboard/page.tsx - THE FINAL & CORRECTED VERSION
"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

// This is the full URL to your backend, provided at build time.
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Device {
  id: string;
  alias: string | null;
  status: string;
  nic: { mac: string } | null;
}

export default function DashboardPage() {
  const { user, isLoading: authIsLoading } = useAuth()
  const [devices, setDevices] = useState<Device[]>([])
  const [macAddress, setMacAddress] = useState("")
  const [isPairing, setIsPairing] = useState(false)
  const [isFetchingDevices, setIsFetchingDevices] = useState(true)

  // Fetch devices when the component loads and the user is available
  useEffect(() => {
    const fetchDevices = async () => {
      if (!user) return; // Don't fetch if there's no user

      setIsFetchingDevices(true);
      try {
        // FIX: Use the full, absolute path to the API
        const response = await fetch(`${API_URL}/api/devices`);
        if (response.ok) {
          const data = await response.json();
          setDevices(data);
        } else {
          toast.error("Failed to fetch devices.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching devices.");
      } finally {
        setIsFetchingDevices(false);
      }
    };

    if (!authIsLoading) {
      fetchDevices();
    }
  }, [user, authIsLoading]);

  const handlePairDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!macAddress) {
      toast.error("MAC Address cannot be empty.");
      return;
    }
    setIsPairing(true);
    try {
      // FIX: Use the full, absolute path to the API
      const response = await fetch(`${API_URL}/api/devices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mac: macAddress }),
      });

      const newDevice = await response.json();

      if (response.ok) {
        toast.success("Device paired successfully!");
        setDevices(prevDevices => [...prevDevices, newDevice]); // Add new device to the list
        setMacAddress(""); // Clear the input
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
    return <div className="p-8">Loading dashboard...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user?.email}</h1>
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
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 transition-colors flex items-center justify-center"
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
            <p className="text-gray-500">Loading devices...</p>
          ) : devices.length > 0 ? (
            <div className="space-y-4">
              {devices.map(device => (
                <div key={device.id} className="bg-gray-900 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-bold">{device.alias || `Device ${device.id.slice(0, 6)}`}</p>
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