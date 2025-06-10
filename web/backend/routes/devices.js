// backend/routes/devices.js
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { protect } from '../middleware/protect.js'; // Use our auth gatekeeper

const prisma = new PrismaClient();
const router = Router();

// @desc    Register a new device to the logged-in user by its MAC address
// @route   POST /api/devices
router.post('/', protect, async (req, res) => {
  const { mac } = req.body;
  const ownerId = req.user.id; // Get user ID from the 'protect' middleware

  if (!mac) {
    return res.status(400).json({ message: 'MAC address is required' });
  }

  try {
    // 1. Find the physical hardware (Nic) by its MAC address
    const nic = await prisma.nic.findUnique({
      where: { mac: mac.toLowerCase() },
    });

    if (!nic) {
      return res.status(404).json({ message: 'Device with this MAC address not found' });
    }

    // 2. Check if this hardware is already claimed by a logical device
    if (nic.deviceId) {
      return res.status(409).json({ message: 'This device has already been claimed' });
    }

    // 3. Create the new logical Device and link it to the user and the Nic
    const newDevice = await prisma.device.create({
      data: {
        ownerId: ownerId,
        nicId: nic.id,
        // You can add more fields here like an alias later
      },
    });

    res.status(201).json(newDevice);
  } catch (error) {
    console.error('Error adding device:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;