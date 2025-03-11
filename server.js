
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
        console.log("Fetching HTML data...");
        const data = await fetchPage("https://undecember.thein.ru/en/runes");
        // make dom
        const mainDOM = new JSDOM(data);
        const mainDocument = mainDOM.window.document;
        // remove unnecessary elements
        console.log("Removing unnecessary elements...");
        const elementsToRemove = mainDocument.querySelectorAll('script, link, head, style, meta');
        elementsToRemove.forEach(element => element.remove());

        // create basic rune list
        console.log("Creating basic rune list...");
        const runeElementList = mainDocument.querySelectorAll('.content_list_item');
        const runes = new Array(runeElementList.length);
        for(let i = 0; i < runeElementList.length; i++) {
            runes[i] = {
                title: runeElementList[i].querySelector('a').textContent,
                url: `https://undecember.thein.ru${runeElementList[i].querySelector('a').getAttribute('href')}`
            }
        }

        // find subpages
        console.log("Finding subpages...");
        const subPageLinks = mainDocument.querySelectorAll('.content_list_item a');
        const runePromises = Array.from(subPageLinks).map(async (link, i) => {
            const subPageUrl = `https://undecember.thein.ru${link.getAttribute("href")}`;
            console.log(subPageUrl);
            // TODO spoof headers
            try {
                const subPageData = await fetchPage(subPageUrl); // Fetch in parallel
                const subPageDOM = new JSDOM(subPageData);
                const subPageDocument = subPageDOM.window.document;
                return subPageDocument.querySelector('[data-class="prop"]').textContent;
            } catch (error) {
                console.error(`Failed to fetch ${subPageUrl}`, error);
                return null; // Handle failed requests gracefully
            }
        });

        // Execute all fetches in parallel
        console.log("Scraping subpages...");
        // const runeHTMLList = await Promise.all(runePromises);


        // console.log(runes);
    } catch (error) {
        console.error("Error logging HTML data:", error);
    }
}


updateRunes();