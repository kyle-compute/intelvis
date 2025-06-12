// test-mac-formats.js - Run this to test different MAC formats
import prisma from './lib/db.js';

async function testMacFormats() {
  // Replace this with your actual ESP32 MAC address
  // You can get it by running your ESP32 code and checking the Serial output
  const testMac = "fc:01:2c:c6:d9:98"; // REPLACE WITH YOUR ACTUAL ESP32 MAC
  
  // These are the formats we'll test, based on how ESP32 WiFi.macAddress() works
  const formats = [
    testMac,                                    // Original: AA:BB:CC:DD:EE:FF
    testMac.toLowerCase(),                      // ESP32 format: aa:bb:cc:dd:ee:ff
    testMac.toUpperCase(),                      // Uppercase: AA:BB:CC:DD:EE:FF
    testMac.replace(/:/g, ''),                  // No colons: AABBCCDDEEFF
    testMac.replace(/:/g, '-'),                 // Dashes: AA-BB-CC-DD-EE-FF
    testMac.toLowerCase().replace(/:/g, ''),    // No colons lowercase: aabbccddeeff
    testMac.toLowerCase().replace(/:/g, '-')    // Dashes lowercase: aa-bb-cc-dd-ee-ff
  ];
  
  console.log('🔍 Testing MAC formats for ESP32 MAC:', testMac);
  console.log('📡 ESP32 sends it as:', testMac.toLowerCase()); // This is what your ESP32 sends
  console.log('\n--- Testing all possible formats ---');
  
  for (const format of formats) {
    try {
      const nic = await prisma.nic.findUnique({ where: { mac: format } });
      const status = nic ? 'FOUND' : ' NOT FOUND';
      console.log(`Format "${format}": ${status}`);
      if (nic) {
        console.log(`  └─ Device ID: ${nic.deviceId || 'NULL'}`);
      }
    } catch (error) {
      console.log(`Format "${format}": ERROR - ${error.message}`);
    }
  }
  
  // Also list all MACs in database
  const allNics = await prisma.nic.findMany({ 
    select: { mac: true, deviceId: true },
    orderBy: { addedAt: 'desc' }
  });
  
  console.log('\n--- All MACs currently in database ---');
  if (allNics.length === 0) {
    console.log('No NICs found in database! You need to provision devices first.');
  } else {
    allNics.forEach((nic, index) => {
      console.log(`${index + 1}. "${nic.mac}" (Device ID: ${nic.deviceId || 'NULL'})`);
    });
  }
  
  console.log('\n--- Recommendations ---');
  console.log('1. Your ESP32 sends MAC as:', testMac.toLowerCase());
  console.log('2. Make sure to provision the device FIRST using the provision endpoint');
  console.log('3. Check if the MAC in the database matches exactly');
}

testMacFormats().catch(console.error).finally(() => {
  process.exit(0);
});