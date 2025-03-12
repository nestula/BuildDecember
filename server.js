
const express = require("express");
const path = require("path");
const axios = require("axios");
const fs = require("fs");


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


// app.get("/fetch-html", async (req, res) => {
//     try {
//         const response = await axios.get("https://undecember.thein.ru/en/runes/MinionSpeed/"); // Change URL
//         res.send({ html: response.data }); // Send HTML to frontend
//     } catch (error) {
//         console.error("Error fetching HTML:", error);
//         res.status(500).json({ error: "Failed to fetch HTML" });
//     }
// });



app.get("/getJSON", (req, res) => {
  const filePath = path.join(__dirname, "private/resources/RuneList.json"); // Correct path

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ error: "Failed to read JSON file" });
    }
    res.json({ json: JSON.parse(data) }); // Send JSON data
  });
});



const updateRunes = require("./private/scraper/updateRunes");

// updateRunes();