// backend/routes/provision.js - FINAL HARDENED VERSION
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
  // THE FIX: NORMALIZE THE MAC ADDRESS
  // Get the raw MAC from the ESP32 and force it to lowercase.
  const { mac: rawMac } = req.body;
  if (!rawMac) {
    return res.status(400).json({ message: 'MAC address is required' });
  }
  const mac = rawMac.toLowerCase();

  try {
    const existingNic = await prisma.networkInterfaceCard.findUnique({
      where: { mac }, // Use the normalized MAC for the lookup
      include: { device: true },
    });

    if (existingNic) {
      console.log(`Device with MAC ${mac} already provisioned. Returning 200 OK.`);
      return res.status(200).json(existingNic.device);
    }

    console.log(`New device with MAC ${mac}. Provisioning...`);
    const newDevice = await prisma.device.create({
      data: {
        status: 'INACTIVE',
        nic: {
          create: { mac }, // Use the normalized MAC for creation
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