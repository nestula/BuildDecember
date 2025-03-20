import SearchRune from "../../resources/modules/search.js";
import Board from "../../resources/modules/Board.js";
import RuneInfo from "../../resources/modules/RuneInfo.js";

import Packer from "../../resources/modules/Packer.js";
import subRoute from "./subRoute.js";

if(!window.cached_images) {
    window.cached_images = {};
}

const boardParent = document.getElementById("board").parentElement;
const board = new Board(document.getElementById("board"), {width:500, height:500});

document.getElementById("clearBoard").addEventListener("click", () => board.clear());

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

        
        if(window.cached_images[rune.title]) {
            const icon = window.cached_images[rune.title];
            runeItem.appendChild(icon);
        } else {
            const icon = document.createElement("img");
            icon.src = `../../resources/icons/${rune.icon}`;
            runeItem.appendChild(icon);
            window.cached_images[rune.title] = icon;
        }

        // icon.onload = () => {
        //     if(!window.cached_images[rune.title]) {
        //         window.cached_images[rune.title] = icon;
        //     }
        // }

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
    // TODO make cached images for this

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





// copy and share

function copy(str) {
    navigator.clipboard.writeText(str);
    alert("Copied to clipboard!");
}
function copyJSON() {
    const data = JSON.stringify({
        table: board.table
    })
    copy(data);
}
function loadJSON() {
    const data = document.getElementById("loadBox").value;
    if(data) {
        if(data.startsWith("#")) {
            const info = Packer.unpack(data);
            board.table = info.table;
        } else {
            const info = JSON.parse(data);
            board.table = info.table;
        }
    }
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
    localStorage.setItem("buildData", data);
})

function loadLocalStorage() {
    const data = localStorage.getItem("buildData");
    if(!data) {
        alert("No data found in storage (Save localStorage first)");
        return;
    };
    board.table = JSON.parse(data);
    subRoute("boardRoute");
}
document.getElementById("loadStorage").addEventListener("click", loadLocalStorage);
if(localStorage.getItem("buildData")) {
    loadLocalStorage();
}

// compact saving 
document.getElementById("saveCompact").addEventListener("click", () => {
    const table = board.table;
    const compactedData = Packer.compact({
        table
    })
    copy(compactedData);
})

document.getElementById("clearStorage").addEventListener("click", () => {
    if(!confirm("Are you sure you want to clear the storage?")) return;
    localStorage.setItem("buildData", [
        new Array(5),
        new Array(6),
        new Array(7),
        new Array(8),
        new Array(7),
        new Array(6),
        new Array(5)
    ]);
})

// window.addEventListener('beforeunload', function(event) {
//     // The preventDefault() method cancels the event if it is cancelable, meaning that the default action that belongs to the event will not occur.
//     event.preventDefault();
//     // Included for legacy compatibility. Will be ignored by modern browsers.
//     event.returnValue = '';
//     // Customize the confirmation message (Optional)
//     return 'Are you sure you want to leave this page? You may want to save to localStorage before.';
// });


// DPS test
import DPSTest from "../../resources/modules/DPSTest.js";
setTimeout(() => {

    const DPSdata = {
        table: board.table
    }
    console.log(DPSTest(DPSdata));

},1000)