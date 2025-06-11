// backend/routes/provision.js - FINAL, TRIGGER-AWARE VERSION
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();
const PROVISIONING_API_KEY = process.env.PROVISIONING_API_KEY;

const protectProvisioning = (req, res, next) => {
  const apiKey = req.get('X-API-Key');
  if (apiKey && apiKey === PROVISIONING_API_KEY) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized: Invalid or missing API Key' });
  }
};

router.post('/', protectProvisioning, async (req, res) => {
  const { mac: rawMac } = req.body;
  if (!rawMac) {
    return res.status(400).json({ message: 'MAC address is required' });
  }
  const mac = rawMac.toLowerCase();

  try {
    const existingNic = await prisma.networkInterfaceCard.findUnique({
      where: { mac },
      include: { device: true },
    });

    if (existingNic) {
      return res.status(200).json(existingNic.device);
    }

    const newDevice = await prisma.device.create({
      data: {
        status: 'INACTIVE',
        parentId: null, // <-- THE FIX IS HERE. This satisfies the DB trigger.
        nic: {
          create: { mac },
        },
      },
    });
    res.status(201).json(newDevice);

  } catch (error) {
    console.error('Error during provisioning:', error);
    res.status(500).json({ message: 'Internal Server Error during provisioning' });
  }
});

export default router;