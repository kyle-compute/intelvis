// server/index.js
const express = require('express');
const app = express();
const PORT = 4000; // A different port than your Next.js app (which uses 3000)

app.get('/', (req, res) => {
  res.send('Hello from the IntelVis Backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});