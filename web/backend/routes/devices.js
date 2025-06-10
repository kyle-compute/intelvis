// backend/routes/devices.js
import { Router } from 'express';
import { protect } from '../middleware/protect.js'; // Use our auth gatekeeper
import prisma from '../lib/db.js';

const router = Router();

// @desc    Register a new device to the logged-in user by its MAC address
// @route   POST /api/devices// backend/routes/devices.js

// ... keep your import statements and the router.get(...) route ...

router.post('/', protect, async (req, res) => {
  const { mac } = req.body;
  const ownerId = req.user.id;

  if (!mac) {
    return res.status(400).json({ message: 'MAC address is required' });
  }

  try {
    const normalizedMac = mac.toLowerCase();

    // 1. Find the physical hardware (Nic)
    const nic = await prisma.nic.findUnique({
      where: { mac: normalizedMac },
    });

    if (!nic) {
      return res.status(404).json({ message: 'Device not provisioned. Please restart your physical device.' });
    }

    // --- THIS IS THE CRITICAL FIX ---
    // 2. Explicitly check if the Nic is already claimed BEFORE starting a transaction.
    if (nic.deviceId) {
      return res.status(409).json({ message: 'This device has already been claimed.' });
    }
    // --- END OF FIX ---

    // 3. If we get here, the Nic is available. Claim it.
    const newDeviceWithNic = await prisma.$transaction(async (tx) => {
      const createdDevice = await tx.device.create({
        data: {
          ownerId: ownerId,
          alias: `Device ${normalizedMac.slice(-5)}`,
        },
      });

      await tx.nic.update({
        where: { id: nic.id },
        data: { deviceId: createdDevice.id },
      });

      return tx.device.findUnique({
        where: { id: createdDevice.id },
        include: { nic: { select: { mac: true } } },
      });
    });

    res.status(201).json(newDeviceWithNic);

  } catch (error) {
    console.error('Error adding device:', error);
    res.status(500).json({ message: 'Server error during device claim.' });
  }
});

export default router;