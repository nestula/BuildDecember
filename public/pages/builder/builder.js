import SearchRune from "../../resources/modules/search.js";
import Board from "../../resources/modules/Board.js";


const board = new Board(document.getElementById("board"));

function loadRuneData() {
    const searchTerm = document.getElementById("runeSearch").value;
    const runes = SearchRune(searchTerm);
    
    // Display

    const runeList = document.getElementById("runeList");
    runeList.innerHTML = ""; // Clear previous content

    runes.forEach(rune => {
        const runeItem = document.createElement("div");
        runeItem.classList.add("runeItem");

        const icon = document.createElement("img");
        icon.src = `../../resources/icons/${rune.icon}`;
        runeItem.appendChild(icon);
        runeItem.appendChild(document.createTextNode(rune.title));

        // description
        const description = document.createElement("div");
        description.classList.add("description");
        description.textContent = rune.description || "No description available";
        runeItem.appendChild(description);

        runeList.appendChild(runeItem);
    });
    
}

document.getElementById("runeSearch").addEventListener("input", loadRuneData);