// backend/routes/devices.js - FINAL
import { Router } from 'express';
import prisma from '../lib/db.js';

import { protect } from '../middleware/protect.js';

const router = Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const devices = await prisma.device.findMany({
      where: { ownerId: req.user.id },
      include: { nic: true },
    });
    res.status(200).json(devices);
  } catch (error) {
    next(error); // <-- FIX: Pass errors to global handler
  }
});

router.post('/', async (req, res, next) => {
  const { mac: rawMac } = req.body;
  if (!rawMac) return res.status(400).json({ message: 'MAC required' });
  
  const mac = rawMac.toLowerCase().trim();

  try {
    const nic = await prisma.networkInterfaceCard.findUnique({ where: { mac } });
    if (!nic || !nic.deviceId) {
      return res.status(404).json({ message: 'Unprovisioned device not found' });
    }

    const device = await prisma.device.findUnique({ where: { id: nic.deviceId } });
    if (!device) {
      return res.status(404).json({ message: 'Device data inconsistent' });
    }
    if (device.ownerId) {
      return res.status(409).json({ message: 'Device already paired' });
    }

    const updatedDevice = await prisma.device.update({
      where: { id: device.id },
      data: { ownerId: req.user.id },
      include: { nic: true },
    });
    res.status(201).json(updatedDevice);
  } catch (error) {
    console.error('Pairing Error:', error.message);
    next(error); // <-- FIX: Pass errors to global handler
  }
});

export default router;