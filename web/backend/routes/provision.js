import { Router } from 'express';
import prisma from '../lib/db.js';
import { protectProvision } from '../middleware/protectProvision.js';

const router = Router();

// @desc    A device provisions itself by sending its MAC address
// @route   POST /api/provision
// @access  Protected by API Key
router.post('/', protectProvision, async (req, res) => {
  const { mac } = req.body;

  if (!mac) {
    return res.status(400).json({ message: 'MAC address is required' });
  }

  const normalizedMac = mac.toLowerCase();

  try {
    // Use `upsert`: create if it doesn't exist, do nothing if it does.
    // This makes the endpoint robust and safe to call multiple times.
    const nic = await prisma.nic.upsert({
      where: { mac: normalizedMac },
      update: {}, // Nothing to update if it already exists
      create: { mac: normalizedMac },
    });

    res.status(200).json({ message: 'Device provisioned successfully', mac: nic.mac });
  } catch (error) {
    console.error('Provisioning error:', error);
    res.status(500).json({ message: 'Server error during provisioning' });
  }
});

export default router;