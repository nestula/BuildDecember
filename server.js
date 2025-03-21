
const express = require("express");
const path = require("path");
const axios = require("axios");
const fs = require("fs");

const favicon = require("serve-favicon");



const app = express();
const PORT = process.env.PORT || 9999; // Use a different port if 3000 is in use -> 3333

app.set('trust proxy', true);

app.use((req, res, next) => {
  // get ./private/resources/WebStats.json
  const webStatsPath = path.join(__dirname, "private/resources/WebStats.json"); // Correct path

  fs.readFile(webStatsPath, "utf8", (err, data) => {
    if (err) {
      console.log("Error reading file:", err);
    } else {
      const webStats = JSON.parse(data);
      // visits
      webStats.visits += 1;
      // unique
      if (!webStats.logged.includes(req.ip)) {
        if (req.ip !== null) {
          webStats.uniqueVisits += 1;
          webStats.logged.push(req.ip);
        }
      }

      fs.writeFile(webStatsPath, JSON.stringify(webStats, null, 2), "utf8", (err) => {
        if (err) {
          console.log("Error writing file:", err);
        }
      })
    }
  });

  next()
});

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

app.use(favicon(path.join(__dirname, "public", "favicon.png")));

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


///// middleware /////



app.get("/updateMetrics", (req, res) => {
  // console.log("Visit")
})

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