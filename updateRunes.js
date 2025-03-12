// fs and updating json

const fs = require("fs");
const { JSDOM } = require("jsdom");
const axios = require("axios");

// List of potential User-Agent strings
const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.0',
    'Mozilla/5.0 (Windows NT 6.3; rv:40.0) Gecko/20100101 Firefox/40.0'
];

// Function to get a random item from an array
function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

// Sleep function to introduce delay between requests
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchPage(url) {
    const headers = {
        'User-Agent': getRandomElement(userAgents), // Random User-Agent
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache'
    };
    
    try {
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        console.error("Error fetching HTML:", error);
        throw error;
    }
}

async function updateRunes() {
    try {
        console.log("Fetching HTML data...");
        const data = await fetchPage("https://undecember.thein.ru/en/runes");
        
        // Make DOM
        const mainDOM = new JSDOM(data);
        const mainDocument = mainDOM.window.document;

        // Remove unnecessary elements
        console.log("Removing unnecessary elements...");
        const elementsToRemove = mainDocument.querySelectorAll('script, link, head, style, meta');
        elementsToRemove.forEach(element => element.remove());

        // Create basic rune list
        console.log("Creating basic rune list...");
        const runeElementList = mainDocument.querySelectorAll('.content_list_item');
        const runes = new Array(runeElementList.length);
        for(let i = 0; i < runeElementList.length; i++) {
            runes[i] = {
                title: runeElementList[i].querySelector('a').textContent,
                url: `https://undecember.thein.ru${runeElementList[i].querySelector('a').getAttribute('href')}`
            };
        }

        // Find subpages
        console.log("Finding subpages...");
        const subPageLinks = mainDocument.querySelectorAll('.content_list_item a');
        const runePromises = [];
        const subPageHTML = [];

        // Function to fetch subpage data and handle it
        const fetchSubpageData = async (index) => {
            const link = subPageLinks[index];
            const subPageUrl = `https://undecember.thein.ru${link.getAttribute("href")}`;
            console.log(`Fetching subpage: ${subPageUrl}`);
            
            try {
                const subPageData = await fetchPage(subPageUrl);
                const subPageDOM = new JSDOM(subPageData);
                const subPageDocument = subPageDOM.window.document;
                const propData = subPageDocument.querySelector('[data-class="prop"]').textContent;

                // Store the result in the promises array and subPageHTML
                runePromises[index] = propData;
                subPageHTML[index] = subPageDocument.documentElement.innerHTML; // Save the entire HTML

            } catch (error) {
                console.error(`Failed to fetch ${subPageUrl}`, error);
                runePromises[index] = null; // Store null if there is an error
                subPageHTML[index] = null; // Store null if there is an error
            }
        };

        // Loop through the subpages with a delay between each request
        for (let currentIndex = 0; currentIndex < subPageLinks.length; currentIndex++) {
            await fetchSubpageData(currentIndex);
            // Add a delay of 1 second (1000ms) between requests
            await sleep(100); // Adjust the time (in ms) to a reasonable value to avoid rate limiting
        }

        // Log all the fetched subpages' innerHTML
        console.log("All fetched subpages HTML:");
        subPageHTML.forEach((html, index) => {
            if (html) {
                // Use JSDOM to parse the HTML of the subpage
                const subPageDOM = new JSDOM(html);
                const content = subPageDOM.window.document.getElementById("content");
        
                if (content) {
                    // Extract minimum rarity value
                    const minRarityElement = content.querySelector('[data-class="MinRarity"] span');
                    const minRarity = minRarityElement ? minRarityElement.textContent : "Unknown";
        
                    // Save the extracted data to the runes array
                    runes[index].minRarity = minRarity;
                    // Optionally, store the cleaned HTML
                    // runes[index].html = content.innerHTML;
        
                    console.log(`Subpage ${index + 1} minRarity: ${minRarity}`);
                } else {
                    console.log(`Subpage ${index + 1} doesn't have content.`);
                }
            } else {
                console.log(`Subpage ${index + 1} failed to load.`);
            }
        });

        console.log("Scraped data:", runes);

        // Write the scraped data to a JSON file
        console.log("Writing to JSON file...");
        const jsonData = JSON.stringify(runes);
        fs.writeFileSync('./private/resources/RuneList.json', jsonData);
    } catch (error) {
        console.error("Error logging HTML data:", error);
    }
}



module.exports = updateRunes;