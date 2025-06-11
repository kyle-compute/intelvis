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
  const { mac } = req.body;
  if (!mac) {
    return res.status(400).json({ message: 'MAC address is required' });
  }

  try {
    // 1. Find the NetworkInterfaceCard (NIC) by its MAC address.
    const nic = await prisma.networkInterfaceCard.findUnique({ where: { mac } });

    if (!nic) {
      return res.status(404).json({ message: 'Device with this MAC not found' });
    }

    // 2. Check if the device it belongs to is already owned.
    const device = await prisma.device.findUnique({ where: { id: nic.deviceId } });

    if (!device) {
        return res.status(404).json({ message: 'Device not found for this MAC' });
    }

    if (device.ownerId) {
      return res.status(409).json({ message: 'Device is already paired to an account' });
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
    res.status(500).json({ message: 'Error pairing device' });
  }
});

export default router;