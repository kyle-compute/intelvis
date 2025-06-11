import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();
const PROVISIONING_API_KEY = process.env.PROVISIONING_API_KEY;

// Middleware to protect the provisioning endpoint
const protectProvisioning = (req, res, next) => {
  if (req.get('X-API-Key') === PROVISIONING_API_KEY) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// This endpoint is idempotent and handles case-insensitivity.
router.post('/', protectProvisioning, async (req, res) => {
  const { mac: rawMac } = req.body;
  if (!rawMac) {
    return res.status(400).json({ message: 'MAC address is required' });
  }
  const mac = rawMac.toLowerCase();

  try {
    const existingNic = await prisma.networkInterfaceCard.findUnique({
      where: { mac },
    });

    if (existingNic) {
      console.log(`Device with MAC ${mac} already exists.`);
      return res.status(200).json({ message: 'Device already provisioned' });
    }

    // If it does not exist, create it.
    await prisma.device.create({
      data: {
        status: 'INACTIVE',
        parentId: null, // Critical for the database trigger
        nic: {
          create: { mac },
        },
      },
    });
    
    console.log(`Successfully provisioned new device with MAC ${mac}.`);
    res.status(201).json({ message: 'Device provisioned successfully' });

  } catch (error) {
    console.error('CRITICAL PROVISIONING ERROR:', error);
    res.status(500).json({ message: 'Internal Server Error during provisioning' });
  }
});

export default router;