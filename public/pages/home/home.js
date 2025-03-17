import SearchRune from "../../resources/modules/search.js";


function displayRunes(runes) {

    const iconContainer = document.getElementById("runeList");
    iconContainer.innerHTML = ""; // Clear previous content

    let limit = parseInt(document.getElementById("limit").value) || 30;
    if(limit<5) limit = 5; // Minimum limit
    if(limit>runes.length) limit = runes.length; // Maximum limit
    document.getElementById("limit").max = runes.length; // Update limit input

    runes.slice(0, limit).forEach(rune => {
        const runeItem = document.createElement("div");
        runeItem.classList.add("runeItem");

        const icon = document.createElement("img");
        icon.src = `./resources/icons/${rune.icon}`;
        runeItem.appendChild(icon);
        runeItem.appendChild(document.createTextNode(rune.title));

        // description
        const description = document.createElement("div");
        description.classList.add("description");
        description.textContent = rune.description || "No description available";
        runeItem.appendChild(description);

        iconContainer.appendChild(runeItem);
    });
}

function searchMain(value) {
    if(!value) {
        displayRunes(allRunes);
        return;
    }
    displayRunes(SearchRune(value));
}
const searchElement = document.getElementById("searchBox");
document.getElementById("searchBox").addEventListener("input", ()=>{searchMain(searchElement.value)});
document.getElementById("limit").addEventListener("input", ()=>{searchMain(searchElement.value)}); // Refresh on limit change

function checkRunes() {
    if(!window.allRunes) {
        setTimeout(() => {
            checkRunes();
        }, 500);
    } else {
        displayRunes(allRunes);
    }
}
checkRunes();