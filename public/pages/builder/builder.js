import SearchRune from "../../resources/modules/search.js";
import Board from "../../resources/modules/Board.js";
import RuneInfo from "../../resources/modules/RuneInfo.js";

if(!window.cached_images) {
    window.cached_images = {};
}

const boardParent = document.getElementById("board").parentElement;
const board = new Board(document.getElementById("board"), {width:500, height:500});

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
        runeItem.style.userSelect = "none";
        runeItem.classList.add("runeItem");

        const icon = document.createElement("img");
        icon.src = `../../resources/icons/${rune.icon}`;
        runeItem.appendChild(icon);

        icon.onload = () => {
            if(!window.cached_images[rune.title]) {
                window.cached_images[rune.title] = icon;
            }
        }

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

        runeItem.addEventListener("mousedown", (event) => { 
            const rune = runeItem.querySelector(".runeName").textContent;
            status.selectedRune = rune;
            board.currentRune = rune;
        });
        runeItem.addEventListener("click", (event) => { 
            const rune = runeItem.querySelector(".runeName").textContent;
            showRuneInfo(rune);
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
        loadRuneData();
    }
}
checkRunes();


function showRuneInfo(name) {
    const rune = window.allRunes.find(r => r.title == name);

    const img = document.getElementById("runeIcon");
    img.src = `../../resources/icons/${rune.icon}`;

    const runeName = document.getElementById("runeName");
    runeName.textContent = rune.title;

    const runeDescription = document.getElementById("runeDescription");
    runeDescription.textContent = rune.description || "No description available";

    const runeMinRarity = document.getElementById("runeMinRarity");
    runeMinRarity.innerHTML = `Min. Rarity: <span style="font-style: italic">${rune.minRarity}</span>`;
}
board.mouse.externalmouseup = ()=>{
    if(!board.currentRune) return;
    showRuneInfo(board.currentRune);
};


document.getElementById("runeSearch").addEventListener("input", loadRuneData);



function subRoute(page) {
    const sections = document.getElementById("activeSection");
    const subSections = sections.children;
    
    for(const section of subSections) {
        section.style.display = "none";
    }
    const subRouteLookup = {
        "LoadShareRoute": document.getElementById("loadShareSection"),
        "statsRoute": document.getElementById("statsSection"),
        "boardRoute": document.getElementById("boardSection"),
        "zodiacRoute": document.getElementById("zodiacSection"),
        "gearRoute": document.getElementById("gearSection"),
        "shareRoute": document.getElementById("shareSection"),
    }
    if(subRouteLookup[page]) {
        subRouteLookup[page].style.display = "flex";
    }
}
document.getElementById("LoadShareRoute").addEventListener("click", () => subRoute("LoadShareRoute"));
document.getElementById("statsRoute").addEventListener("click", () => subRoute("statsRoute"));
document.getElementById("boardRoute").addEventListener("click", () => subRoute("boardRoute"));
document.getElementById("zodiacRoute").addEventListener("click", () => subRoute("zodiacRoute"));
document.getElementById("gearRoute").addEventListener("click", () => subRoute("gearRoute"));
document.getElementById("shareRoute").addEventListener("click", () => subRoute("shareRoute"));


// copy and share


function copyJSON() {
    const data = JSON.stringify(board.table);
    navigator.clipboard.writeText(data);
    alert("JSON copied to clipboard!");
}
function loadJSON() {
    const data = document.getElementById("loadBox").value;
    board.table = JSON.parse(data);
    subRoute("boardRoute");
}

document.getElementById("copyJSON").addEventListener("click", () => {
    copyJSON();
}) 

document.getElementById("loadButton").addEventListener("click", () => {
    loadJSON();
})
document.getElementById("clearLoad").addEventListener("click", () => {
    document.getElementById("loadBox").value = "";
})

// local saving

document.getElementById("saveStorage").addEventListener("click", () => {
    const data = JSON.stringify(board.table);
    localStorage.setItem("runeBoard", data);
})

document.getElementById("loadStorage").addEventListener("click", () => {
    const data = localStorage.getItem("runeBoard");
    if(!data) {
        alert("No data found in storage (Save localStorage first)");
        return;
    };
    board.table = JSON.parse(data);
    subRoute("boardRoute");
})

document.getElementById("clearStorage").addEventListener("click", () => {
    if(!confirm("Are you sure you want to clear the storage?")) return;
    localStorage.setItem("runeBoard", [
        new Array(5),
        new Array(6),
        new Array(7),
        new Array(8),
        new Array(7),
        new Array(6),
        new Array(5)
    ]);
})