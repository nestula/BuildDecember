
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 9999; // Use a different port if 3000 is in use -> 3333

app.set('trust proxy', true);

const WEBSTATS_PATH = path.join(__dirname, "WebStats.json");


// // routes
// app.use((req, res, next) => {
//     const validPages = ["/", "/pages/home/home.html", "/pages/builder/builder.html"];

//     if (!validPages.includes(req.path)) {
//         return res.redirect("/pages/home/home.html");
//     }
//     next();
// });


// middleware
app.get("/pages/builder/builder.html", (req, res) => {
    try {

        fs.readFile(WEBSTATS_PATH, "utf8", (err, data) => {
            if (err) {
                console.log("Error reading file:", err);
                return res.sendFile(path.join(__dirname, "../frontend/pages/builder/builder.html"));
            }

            let webStats;
            try {
                webStats = JSON.parse(data);
            } catch (parseError) {
                console.log("Error parsing JSON:", parseError);
                return res.sendFile(path.join(__dirname, "../frontend/pages/builder/builder.html"));
            }

            webStats.views += 1;

            if (!webStats.logged.includes(req.ip)) {
                if (req.ip !== null) {
                    webStats.uniqueVisits += 1;
                    webStats.logged.push(req.ip);
                }
            }

            fs.writeFile(WEBSTATS_PATH, JSON.stringify(webStats, null, 2), "utf8", (writeErr) => {
                if (writeErr) {
                    console.log("Error writing file:", writeErr);
                }
                // Regardless of write success, send the page
                res.sendFile(path.join(__dirname, "../frontend/pages/builder/builder.html"));
            });
        });


    } catch (err) {
        console.log("Error:", err);
    }
});


// serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "../frontend")));

// start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// app.use((req, res) => {
//     const ext = path.extname(req.originalUrl);

//     // If no extension, or .html — assume it's a page navigation, not an asset
//     if (!ext || ext === ".html") {
//         res.sendFile(path.join(__dirname, "../frontend/pages/home/home.html"));
//     } else {
//         res.status(404).send("Not found");
//     }
// });

