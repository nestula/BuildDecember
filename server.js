
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


// fs and updating json

const fs = require("fs");
const { JSDOM } = require("jsdom");

async function fetchPage(url) {
    return axios.get(url)
        .then(response => response.data)
        .catch(error => {
            console.error("Error fetching HTML:", error);
            throw error;
        })
}

async function updateRunes() {
    try {
        const data = await fetchPage("https://undecember.thein.ru/en/runes");
        // make dom
        const mainDOM = new JSDOM(data);
        const mainDocument = mainDOM.window.document;
        // remove unnecessary elements
        const elementsToRemove = mainDocument.querySelectorAll('script, link, head, style, meta');
        elementsToRemove.forEach(element => element.remove());
        // log
        console.log(mainDocument.body.textContent);
    } catch (error) {
        console.error("Error logging HTML data:", error);
    }
}


updateRunes();