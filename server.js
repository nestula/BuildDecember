const express = require("express");
const app = express();
const PORT = 3000;

// Serve static files from 'public' folder
app.use(express.static("public"));

// API Route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Node.js!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});