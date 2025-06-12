// backend/routes/devices.js - ENHANCED WITH DEBUGGING
import { Router } from 'express';
import prisma from '../lib/db.js';
import { protect } from '../middleware/protect.js';

const router = Router();

// POST /api/devices/register - Device auto-registration endpoint (no auth required)
router.post('/register', async (req, res, next) => {
  const { mac: rawMac } = req.body;
  
  console.log('--- DEVICE REGISTRATION DEBUG ---');
  console.log('Raw MAC from registration:', rawMac);
  
  if (!rawMac) {
    console.log('ERROR: MAC required for registration');
    return res.status(400).json({ message: 'MAC required' });
  }
  
  const mac = rawMac.toLowerCase().trim();
  console.log('Processed MAC for registration:', mac);

  try {
    // Check if device already exists
    const existingNic = await prisma.nic.findUnique({ 
      where: { mac },
      include: { device: true }
    });
    
    if (existingNic) {
      console.log('Device already registered:', existingNic.device?.id || 'no device linked');
      return res.status(200).json({ 
        message: 'Device already registered',
        deviceId: existingNic.device?.id,
        status: existingNic.device?.status || 'INACTIVE'
      });
    }

    // Auto-register new device without owner
    const newDevice = await prisma.device.create({
      data: {
        status: 'ACTIVE',
        ownerId: null, // No owner assigned yet
        parentId: null,
        nic: {
          create: { mac },
        },
      },
      include: {
        nic: true,
      },
    });
    
    console.log('Successfully registered new device:', newDevice.id);
    console.log('--- END REGISTRATION DEBUG ---');
    
    res.status(201).json({ 
      message: 'Device registered successfully',
      deviceId: newDevice.id,
      status: 'ACTIVE'
    });
    
  } catch (error) {
    console.error('ERROR in registration process:', error);
    console.log('--- END REGISTRATION DEBUG (ERROR) ---');
    next(error);
  }
});

// POST /api/devices/ping - Device ping endpoint (no auth required)  
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
    // Find device by MAC and update timestamp
    const nic = await prisma.nic.findUnique({ 
      where: { mac },
      include: { device: true }
    });
    
    if (!nic || !nic.device) {
      console.log('Device not found for ping:', mac);
      return res.status(404).json({ message: 'Device not registered' });
    }

    // Update device timestamp
    await prisma.device.update({
      where: { id: nic.device.id },
      data: { updatedAt: new Date() }
    });
    
    console.log('Successfully pinged device:', nic.device.id);
    console.log('--- END PING DEBUG ---');
    
    res.status(200).json({ 
      message: 'Ping successful',
      deviceId: nic.device.id,
      status: nic.device.status
    });
    
  } catch (error) {
    console.error('ERROR in ping process:', error);
    console.log('--- END PING DEBUG (ERROR) ---');
    next(error);
  }
});

// Apply authentication middleware to all routes below this point
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
      console.log('NIC not found - auto-registering new device');
      // Auto-register new device when MAC address is not found
      try {
        const newDevice = await prisma.device.create({
          data: {
            status: 'INACTIVE',
            ownerId: req.user.id, // Assign to current user
            parentId: null,
            nic: {
              create: { mac },
            },
          },
          include: {
            nic: true,
          },
        });
        console.log('Created new device with MAC:', mac);
        console.log('New device ID:', newDevice.id);
        
        // Continue with the pairing process using the newly created device
        const device = newDevice;
        
        return res.status(201).json({
          message: 'Device auto-registered and paired successfully',
          device: {
            id: device.id,
            status: device.status,
            mac: device.nic.mac,
            createdAt: device.createdAt
          }
        });
      } catch (error) {
        console.log('Error auto-registering device:', error);
        return res.status(500).json({ message: 'Failed to auto-register device' });
      }
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


// POST /api/devices/update - Device update endpoint
router.post('/update', async (req, res, next) => {
  const { mac: rawMac, ...updateData } = req.body;
  
  console.log('--- DEVICE UPDATE DEBUG ---');
  console.log('Raw MAC from update:', rawMac);
  console.log('Update data:', updateData);
  
  if (!rawMac) {
    console.log('ERROR: MAC required for update');
    return res.status(400).json({ message: 'MAC required' });
  }
  
  const mac = rawMac.toLowerCase().trim();
  console.log('Processed MAC for update:', mac);

  try {
    const nic = await prisma.nic.findUnique({ 
      where: { mac },
      include: { device: true }
    });
    
    if (!nic || !nic.device) {
      console.log('ERROR: Device not found for update');
      return res.status(404).json({ message: 'Device not found' });
    }

    const device = nic.device;
    console.log('Device update for:', device.id);
    
    // Update device with provided data
    const updatedDevice = await prisma.device.update({
      where: { id: device.id },
      data: { 
        updatedAt: new Date(),
        status: 'ACTIVE',
        ...updateData
      }
    });
    
    console.log('SUCCESS: Device updated');
    console.log('--- END UPDATE DEBUG ---');
    res.status(200).json({ 
      message: 'Device updated successfully',
      deviceId: device.id,
      status: 'ACTIVE'
    });
    
  } catch (error) {
    console.error('ERROR in update process:', error);
    console.log('--- END UPDATE DEBUG (ERROR) ---');
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

router.put('/:deviceId', async (req, res, next) => {
  const { deviceId } = req.params;
  const { alias } = req.body;
  
  console.log('--- DEVICE RENAME DEBUG ---');
  console.log('Device ID:', deviceId);
  console.log('New alias:', alias);
  console.log('User ID:', req.user.id);
  
  if (!alias || typeof alias !== 'string' || alias.trim().length === 0) {
    console.log('ERROR: Invalid alias provided');
    return res.status(400).json({ message: 'Valid alias is required' });
  }
  
  const trimmedAlias = alias.trim();
  
  if (trimmedAlias.length > 50) {
    console.log('ERROR: Alias too long');
    return res.status(400).json({ message: 'Alias must be 50 characters or less' });
  }

  try {
    const device = await prisma.device.findUnique({
      where: { id: deviceId },
      include: { nic: true }
    });
    
    if (!device) {
      console.log('ERROR: Device not found');
      return res.status(404).json({ message: 'Device not found' });
    }
    
    if (device.ownerId !== req.user.id) {
      console.log('ERROR: User does not own this device');
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const updatedDevice = await prisma.device.update({
      where: { id: deviceId },
      data: { alias: trimmedAlias },
      include: { nic: true }
    });
    
    console.log('SUCCESS: Device renamed');
    console.log('--- END RENAME DEBUG ---');
    res.status(200).json(updatedDevice);
    
  } catch (error) {
    console.error('ERROR in device rename:', error);
    console.log('--- END RENAME DEBUG (ERROR) ---');
    next(error);
  }
});

export default router;