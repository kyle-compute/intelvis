// A simple API key middleware for device provisioning
export const protectProvision = (req, res, next) => {
  const providedKey = req.header('X-API-Key');
  const expectedKey = process.env.PROVISIONING_API_KEY;

  if (!expectedKey) {
    // Fail safely if the key isn't configured on the server
    console.error("PROVISIONING_API_KEY is not set in .env");
    return res.status(500).json({ message: 'Server configuration error' });
  }

  if (providedKey && providedKey === expectedKey) {
    next(); // Key is valid, proceed
  } else {
    res.status(401).json({ message: 'Unauthorized: Invalid or missing API key' });
  }
};