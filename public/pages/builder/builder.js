import SearchRune from "../../resources/modules/search.js";
import Board from "../../resources/modules/Board.js";

const boardParent = document.getElementById("board").parentElement;
const board = new Board(document.getElementById("board"));

const status = {
   selectedRune: null 
}


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

        // name
        const name = document.createElement("span");
        name.setAttribute("class", "runeName");

        name.innerText=rune.title;
        runeItem.appendChild(name);

        // description
        const description = document.createElement("div");
        description.classList.add("description");
        description.textContent = rune.description || "No description available";
        runeItem.appendChild(description);

        runeList.appendChild(runeItem);

        runeItem.addEventListener("click", (event) => { 
            const rune = runeItem.querySelector(".runeName").textContent;
            status.selectedRune = rune;
            board.currentRune = rune;
        });
    });
    
}



function checkRunes() {
    if(!window.allRunes) {
        setTimeout(() => {
            checkRunes();
        }, 500);
    } else {
        console.log('Runes Loaded');
    }
}
checkRunes();


document.getElementById("runeSearch").addEventListener("input", loadRuneData);