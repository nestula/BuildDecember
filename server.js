
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3001; // Use a different port if 3000 is in use

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

// axios

const axios = require("axios");

app.get("/fetch-html", async (req, res) => {
    try {
        const response = await axios.get("https://undecember.thein.ru/en/runes/MinionSpeed/"); // Change URL
        res.send({ html: response.data }); // Send HTML to frontend
    } catch (error) {
        console.error("Error fetching HTML:", error);
        res.status(500).json({ error: "Failed to fetch HTML" });
    }
});




const updateRunes = require("./updateRunes");

updateRunes();