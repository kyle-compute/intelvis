import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();
const PROVISIONING_API_KEY = process.env.PROVISIONING_API_KEY;

// Middleware to protect the provisioning endpoint
const protectProvisioning = (req, res, next) => {
  const apiKey = req.get('X-API-Key');
  if (apiKey && apiKey === PROVISIONING_API_KEY) {
    return next();
  }
  // Log failed attempt for security monitoring
  console.warn(`[AUTH] Failed provision attempt from IP ${req.ip} with key: ${apiKey || 'none'}`);
  res.status(401).json({ message: 'Unauthorized' });
};

// POST /api/provision
// Idempotent and case-insensitive provisioning endpoint.
router.post('/', protectProvisioning, async (req, res, next) => {
  const { mac: rawMac } = req.body;

  if (!rawMac || typeof rawMac !== 'string' || rawMac.trim() === '') {
    // Return a clear error for bad requests.
    return res.status(400).json({ message: 'Field "mac" is required and must be a non-empty string.' });
  }

  const mac = rawMac.toLowerCase().trim();

  try {
    const existingNic = await prisma.networkInterfaceCard.findUnique({
      where: { mac },
    });

    if (existingNic) {
      console.log(`[PROVISION] Device with MAC ${mac} already exists. Responding 200 OK.`);
      return res.status(200).json({ message: 'Device already provisioned', deviceId: existingNic.deviceId });
    }

    console.log(`[PROVISION] New device. Creating entry for MAC ${mac}.`);
    const newDevice = await prisma.device.create({
      data: {
        status: 'INACTIVE',
        parentId: null, // Satisfies database trigger
        nic: {
          create: { mac },
        },
      },
    });
    
    console.log(`[PROVISION] Successfully provisioned new device (ID: ${newDevice.id}) with MAC ${mac}.`);
    res.status(201).json({ message: 'Device provisioned successfully', deviceId: newDevice.id });

  } catch (error) {
    // The key change: Pass the error to the global error handler in index.js
    // It will log the full stack trace and send the 500 response.
    error.message = `Provisioning failed for MAC [${mac}]: ${error.message}`;
    next(error);
  }
});

export default router;