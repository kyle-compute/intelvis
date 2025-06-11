import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();
const PROVISIONING_API_KEY = process.env.PROVISIONING_API_KEY;

// Middleware to protect the provisioning endpoint with a static API key
const protectProvisioning = (req, res, next) => {
  const apiKey = req.get('X-API-Key');
  if (apiKey && apiKey === PROVISIONING_API_KEY) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized: Invalid or missing API Key' });
  }
};

// POST /api/provision
// This endpoint is now idempotent. It can be called multiple times without error.
router.post('/', protectProvisioning, async (req, res) => {
  const { mac } = req.body;
  if (!mac) {
    return res.status(400).json({ message: 'MAC address is required' });
  }

  try {
    // 1. Check if a device with this MAC already exists.
    const existingNic = await prisma.networkInterfaceCard.findUnique({
      where: { mac },
      include: { device: true }, // Also get the parent device
    });

    if (existingNic) {
      // 2. If it exists, it's already provisioned. Return the existing device data.
      console.log(`Device with MAC ${mac} already provisioned. Returning existing data.`);
      return res.status(200).json(existingNic.device); // Use 200 OK, not 201 Created
    }

    // 3. If it does not exist, create it.
    console.log(`New device with MAC ${mac}. Provisioning...`);
    const newDevice = await prisma.device.create({
      data: {
        status: 'INACTIVE',
        nic: {
          create: { mac },
        },
      },
    });
    res.status(201).json(newDevice); // Use 201 Created for a new resource

  } catch (error) {
    // This will catch any other unexpected database errors.
    console.error('Error during provisioning:', error);
    res.status(500).json({ message: 'Internal Server Error during provisioning' });
  }
});

export default router;