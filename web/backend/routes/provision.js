// backend/routes/provision.js - FOR NIC MODEL
import { Router } from 'express';
import prisma from '../lib/db.js';

const router = Router();
const PROVISIONING_API_KEY = process.env.PROVISIONING_API_KEY;

const protectProvisioning = (req, res, next) => {
  const apiKey = req.get('X-API-Key');
  if (apiKey && apiKey === PROVISIONING_API_KEY) {
    return next();
  }
  console.warn(`[AUTH] Failed provision attempt from IP ${req.ip} with key: ${apiKey || 'none'}`);
  res.status(401).json({ message: 'Unauthorized' });
};

// POST /api/provision
router.post('/', protectProvisioning, async (req, res, next) => {
  const { mac: rawMac } = req.body;

  if (!rawMac || typeof rawMac !== 'string' || rawMac.trim() === '') {
    return res.status(400).json({ message: 'Field "mac" is required.' });
  }

  const mac = rawMac.toLowerCase().trim();

  try {
    // CHANGED: Use 'nic' instead of 'networkInterfaceCard'
    const existingNic = await prisma.nic.findUnique({
      where: { mac },
    });

    if (existingNic) {
      console.log(`[PROVISION] Device with MAC ${mac} already exists.`);
      return res.status(200).json({ message: 'Device already provisioned', deviceId: existingNic.deviceId });
    }

    console.log(`[PROVISION] New device. Creating entry for MAC ${mac}.`);
    const newDevice = await prisma.device.create({
      data: {
        status: 'INACTIVE',
        parentId: null,
        nic: {
          create: { mac },
        },
      },
      include: {
        nic: true,
      },
    });
    
    console.log(`[PROVISION] Provisioned new device (ID: ${newDevice.id}) for MAC ${mac}.`);
    res.status(201).json({ message: 'Device provisioned successfully', deviceId: newDevice.id });

  } catch (error) {
    console.error(`[PROVISION] Error for MAC ${mac}:`, error);
    error.message = `Provisioning failed for MAC [${mac}]: ${error.message}`;
    next(error);
  }
});

export default router;