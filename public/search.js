let HasLoadedJSON = false;
let allRunes = []; // Store all runes globally

async function getRuneJSONData() {
    try {
        if(HasLoadedJSON) {
            return null; // Return null if data is already loaded
        }
        // Fetch the JSON data from the server
        const response = await fetch("/getJSON");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        allRunes = data.json; // Store runes globally
        window.allRunes= allRunes; // Make it accessible globally
        HasLoadedJSON = true; // Set the flag to true once data is loaded
        displayRunes(allRunes); // Display initially
        return data.json; // Return the JSON data
    } catch (error) {
        console.error("Error fetching JSON:", error);
    }
}


function displayRunes(runes) {
    const iconContainer = document.getElementById("runeList");
    iconContainer.innerHTML = ""; // Clear previous content

    const limit = parseInt(document.getElementById("limit").value) || 30;
    runes.slice(0, limit).forEach(rune => {
        const runeItem = document.createElement("div");
        runeItem.classList.add("runeItem");

        const icon = document.createElement("img");
        icon.src = `./resources/icons/${rune.icon}`;
        runeItem.appendChild(icon);
        runeItem.appendChild(document.createTextNode(rune.title));

        iconContainer.appendChild(runeItem);
    });
}

function SearchRune() {
    const searchTerm = event.target.value.toLowerCase();

    if (!searchTerm) {
        displayRunes(allRunes); // Show full list if search is empty
        return;
    }

    // Fuzzy search: Sort by how close the title matches the input
    const filteredRunes = allRunes
        .map(rune => ({
            ...rune,
            score: rune.title.toLowerCase().includes(searchTerm) 
                ? searchTerm.length / rune.title.length // Rank match quality
                : 0
        }))
        .filter(rune => rune.score > 0) // Remove non-matching runes
        .sort((a, b) => b.score - a.score) // Sort by best match


    displayRunes(filteredRunes);
}

document.getElementById("searchBox").addEventListener("input", SearchRune);
document.getElementById("limit").addEventListener("input", () => displayRunes(allRunes)); // Refresh on limit change


// Load runes when the page loads
getRuneJSONData();

export default SearchRune;