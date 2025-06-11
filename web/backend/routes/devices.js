// backend/routes/devices.js - FINAL HARDENED VERSION
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { protect } from '../middleware/protect.js';

const prisma = new PrismaClient();
const router = Router();

// All device routes are protected. A user must be logged in.
router.use(protect);

// GET /api/devices
// Fetches all devices linked to the currently logged-in user.
router.get('/', async (req, res) => {
  try {
    const devices = await prisma.device.findMany({
      where: { ownerId: req.user.id },
      include: { nic: true }, // Include the MAC address
    });
    res.status(200).json(devices);
  } catch (error) {
    console.error('Failed to fetch devices:', error);
    res.status(500).json({ message: 'Error fetching devices' });
  }
});

// POST /api/devices
// Pairs a new device with the logged-in user using its MAC address.
router.post('/', async (req, res) => {
  // THE FIX: NORMALIZE THE MAC ADDRESS
  // Get the raw MAC from the request and convert it to lowercase.
  // This prevents case-sensitivity mismatches between user input and the database.
  const { mac: rawMac } = req.body;
  if (!rawMac) {
    return res.status(400).json({ message: 'MAC address is required' });
  }
  const mac = rawMac.toLowerCase();

  try {
    // 1. Find the NetworkInterfaceCard (NIC) by its normalized MAC address.
    const nic = await prisma.networkInterfaceCard.findUnique({ where: { mac } });

    // THE FIX: ROBUSTLY HANDLE "NOT FOUND"
    // If 'nic' is null, the device was never provisioned (likely an ESP32 error)
    // or the user typed the MAC address incorrectly. This check prevents the 500 error.
    if (!nic) {
      return res.status(404).json({ message: 'Device not found. Ensure it is powered on and the MAC address is correct.' });
    }

    // 2. Check if the device it belongs to is already owned.
    const device = await prisma.device.findUnique({ where: { id: nic.deviceId } });

    if (!device) {
        // This is a data integrity error, but we handle it gracefully.
        return res.status(404).json({ message: 'Device data is inconsistent. Please contact support.' });
    }

    if (device.ownerId) {
      return res.status(409).json({ message: 'Device is already paired to another account' });
    }
    
    // 3. Assign the device to the current user.
    const updatedDevice = await prisma.device.update({
      where: { id: device.id },
      data: { ownerId: req.user.id },
      include: { nic: true },
    });

    res.status(201).json(updatedDevice);
  } catch (error) {
    console.error('Failed to pair device:', error);
    res.status(500).json({ message: 'An internal error occurred while pairing the device.' });
  }
});

export default router;