
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 9999; // Use a different port if 3000 is in use -> 3333

app.set('trust proxy', true);

const WEBSTATS_PATH = path.join(__dirname, "WebStats.json");

// middleware
app.get("/pages/builder/builder.html", (req, res) => {
    fs.readFile(WEBSTATS_PATH, "utf8", (err, data) => {
        if (err) {
            console.log("Error reading file:", err);
        } else {
            let webStats;
            try {
                webStats = JSON.parse(data);
            } catch {
                return res.sendFile(path.join(__dirname, "../frontend/pages/builder/builder.html"));
            }

            // Increment the call count for the page visit
            webStats.views += 1;

            // Track unique visits based on IP address
            if (!webStats.logged.includes(req.ip)) {
                if (req.ip !== null) {
                    webStats.uniqueVisits += 1;
                    webStats.logged.push(req.ip);
                }
            }

            // Write the updated stats back to the file
            fs.writeFile(WEBSTATS_PATH, JSON.stringify(webStats, null, 2), "utf8", (err) => {
                if (err) {
                    console.log("Error writing file:", err);
                }
            });
        }

        // Serve the page
        res.sendFile(path.join(__dirname, "../frontend/pages/builder/builder.html"));
    });
});


// serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "../frontend")));

// start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// routes
app.use((req, res, next) => {
    const validPages = ["/", "/pages/home/home.html", "/pages/builder/builder.html"];

    if (!validPages.includes(req.path)) {
        return res.redirect("/pages/home/home.html");
    }
    next();
});
