let HasLoadedJSON = false;
let allRunes = []; // Store all runes globally

async function getRuneJSONData() {
    try {
        if(HasLoadedJSON) {
            return null; // Return null if data is already loaded
        }
        // Fetch the JSON data from the server
        const response = await fetch("/RuneList.json");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        allRunes = data.json; // Store runes globally
        window.allRunes= allRunes; // Make it accessible globally
        HasLoadedJSON = true; // Set the flag to true once data is loaded

        return data.json; // Return the JSON data
    } catch (error) {
        console.error("Error fetching JSON:", error);
    }
}




function SearchRune(searchTerm) {
    const terms = searchTerm.toLowerCase().split(/\s+/); // Split by spaces

    const filteredRunes = allRunes
        .map(rune => {
            const title = rune.title.toLowerCase();
            let matchCount = 0;

            // Check how many search terms are found in the title
            terms.forEach(term => {
                if (title.includes(term)) matchCount++;
                const tags = rune.tags.join(" ").toLowerCase();
                if (tags.includes(term)) matchCount++;
                if (rune.type.toLowerCase().includes(term)) matchCount++;
                if (rune.description.toLowerCase().includes(term)) matchCount+=0.5;
            });

            const score = matchCount > 0 ? matchCount / terms.length : 0; // Score based on matches

            return { ...rune, score };
        })
        .filter(rune => rune.score > 0) // Remove non-matching runes
        .sort((a, b) => b.score - a.score); // Sort by best match

    return filteredRunes;
}



// Load runes when the page loads
getRuneJSONData();

export default SearchRune;