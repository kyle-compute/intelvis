// backend/routes/devices.js - ENHANCED WITH DEBUGGING
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
    
    const devicesWithConnectivity = devices.map(device => {
      const lastSeen = device.updatedAt;
      const now = new Date();
      const timeDiff = now - lastSeen;
      const minutesAgo = Math.floor(timeDiff / (1000 * 60));
      
      const isConnected = minutesAgo <= 5;
      
      return {
        ...device,
        connectivity: {
          isConnected,
          lastSeen,
          minutesAgo,
          status: isConnected ? 'ONLINE' : 'OFFLINE'
        }
      };
    });
    
    res.status(200).json(devicesWithConnectivity);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const { mac: rawMac } = req.body;
  
  // Enhanced logging
  console.log('--- DEVICE PAIRING DEBUG ---');
  console.log('Raw request body:', req.body);
  console.log('Raw MAC from request:', rawMac);
  console.log('User ID:', req.user.id);
  
  if (!rawMac) {
    console.log('ERROR: MAC required but not provided');
    return res.status(400).json({ message: 'MAC required' });
  }
  
  const mac = rawMac.toLowerCase().trim();
  console.log('Processed MAC:', mac);

  try {
    // First: Check if NIC exists at all
    console.log('Step 1: Looking for NIC with MAC:', mac);
    const nic = await prisma.nic.findUnique({ 
      where: { mac },
      include: { device: true }
    });
    
    console.log('NIC found:', nic ? 'YES' : 'NO');
    if (nic) {
      console.log('NIC details:', {
        id: nic.id,
        mac: nic.mac,
        deviceId: nic.deviceId,
        hasDevice: !!nic.device
      });
    }
    
    if (!nic) {
      console.log('ERROR: NIC not found in database');
      // Let's also check what NICs DO exist
      const allNics = await prisma.nic.findMany({
        select: { mac: true, deviceId: true }
      });
      console.log('All NICs in database:', allNics);
      return res.status(404).json({ message: 'Unprovisioned device not found' });
    }

    if (!nic.deviceId) {
      console.log('ERROR: NIC exists but has no deviceId');
      return res.status(404).json({ message: 'NIC found but not linked to device' });
    }

    const device = nic.device;
    console.log('Device found:', !!device);
    
    if (!device) {
      console.log('ERROR: Device data inconsistent - deviceId exists but device is null');
      return res.status(404).json({ message: 'Device data inconsistent' });
    }
    
    console.log('Device details:', {
      id: device.id,
      ownerId: device.ownerId,
      status: device.status
    });
    
    if (device.ownerId) {
      console.log('ERROR: Device already has owner:', device.ownerId);
      return res.status(409).json({ message: 'Device already paired' });
    }

    // Proceed with pairing
    console.log('Step 2: Pairing device to user');
    const updatedDevice = await prisma.device.update({
      where: { id: device.id },
      data: { ownerId: req.user.id },
      include: { nic: true },
    });
    
    console.log('SUCCESS: Device paired successfully');
    console.log('--- END DEBUG ---');
    res.status(201).json(updatedDevice);
    
  } catch (error) {
    console.error('ERROR in pairing process:', error);
    console.error('Error stack:', error.stack);
    console.log('--- END DEBUG (ERROR) ---');
    next(error);
  }
});

router.post('/ping', async (req, res, next) => {
  const { mac: rawMac } = req.body;
  
  console.log('--- DEVICE PING DEBUG ---');
  console.log('Raw MAC from ping:', rawMac);
  
  if (!rawMac) {
    console.log('ERROR: MAC required for ping');
    return res.status(400).json({ message: 'MAC required' });
  }
  
  const mac = rawMac.toLowerCase().trim();
  console.log('Processed MAC for ping:', mac);

  try {
    const nic = await prisma.nic.findUnique({ 
      where: { mac },
      include: { device: true }
    });
    
    if (!nic || !nic.device) {
      console.log('ERROR: Device not found for ping');
      return res.status(404).json({ message: 'Device not found' });
    }

    const device = nic.device;
    console.log('Device ping from:', device.id);
    
    await prisma.device.update({
      where: { id: device.id },
      data: { 
        updatedAt: new Date(),
        status: 'ACTIVE'
      }
    });
    
    console.log('SUCCESS: Device ping recorded');
    console.log('--- END PING DEBUG ---');
    res.status(200).json({ 
      message: 'Ping received',
      deviceId: device.id,
      status: 'ACTIVE'
    });
    
  } catch (error) {
    console.error('ERROR in ping process:', error);
    console.log('--- END PING DEBUG (ERROR) ---');
    next(error);
  }
});

router.get('/connectivity', async (req, res, next) => {
  try {
    const devices = await prisma.device.findMany({
      where: { ownerId: req.user.id },
      include: { nic: true },
    });
    
    const connectivityStatus = devices.map(device => {
      const lastSeen = device.updatedAt;
      const now = new Date();
      const timeDiff = now - lastSeen;
      const minutesAgo = Math.floor(timeDiff / (1000 * 60));
      
      const isConnected = minutesAgo <= 5;
      
      return {
        deviceId: device.id,
        mac: device.nic?.mac,
        isConnected,
        lastSeen,
        minutesAgo,
        status: isConnected ? 'ONLINE' : 'OFFLINE',
        deviceStatus: device.status
      };
    });
    
    res.status(200).json(connectivityStatus);
  } catch (error) {
    next(error);
  }
});

export default router;