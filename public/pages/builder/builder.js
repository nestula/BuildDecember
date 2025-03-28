import SearchRune from "../../resources/modules/search.js";
import Board from "../../resources/modules/Board.js";
import RuneInfo from "../../resources/modules/RuneInfo.js";

import subRoute from "./subRoute.js";

if(!window.cached_images) {
    window.cached_images = {};
}

const boardMultLandscape = 2.5;
const boardMultPortrait = 1.2;
let boardMultiplier = window.innerWidth > window.innerHeight ? boardMultLandscape : boardMultPortrait;

const calculateBoardSize = () => {
    const maxSize = window.innerHeight * 0.7; // 75% of viewport height
    return Math.min((window.innerWidth / boardMultiplier) | 0, maxSize | 0);
};

const boardSize = calculateBoardSize();
const board = new Board(document.getElementById("board"), { width: boardSize, height: boardSize });

window.addEventListener("resize", () => { // Listen for window resize
    boardMultiplier = window.innerWidth > window.innerHeight ? boardMultLandscape : boardMultPortrait;
    const newSize = calculateBoardSize();
    board.setSize(newSize, newSize);
    board._handleResize();
});



window.board = board;

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

        runeItem.addEventListener("touchstart", (event) => {
            board.mouse.waitingTouchAction=true;

            const rune = runeItem.querySelector(".runeName").textContent;
            status.selectedRune = rune;
            board.currentRune = rune;
            board.savedPosition = -999;
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

    const runeStats = document.getElementById("runeStats");
    runeStats.innerHTML = "";

    if(rune.elementType) {
        document.getElementById("runeElement").innerText = rune.elementType;
    } else {
        document.getElementById("runeElement").innerText = "";
    }

    // tags

    const runeTags = document.getElementById("runeTags");
    runeTags.innerHTML = "";
    if(rune.tags) {
        rune.tags.forEach((tag, index) => {
            runeTags.innerHTML+=`${tag}${index == rune.tags.length - 1 ? '' : ', '}`;
        });
    }

    // stats

    if(rune.stats["level1"]) { // show default
        for(const stat in rune.stats["level1"]) {
            const statDiv = document.createElement("div");
            statDiv.innerHTML = `${stat}: <span class="statAccent">${rune.stats["level1"][stat]}</span>`;
            runeStats.appendChild(statDiv);
        }
    }
 

}
board.mouse.externalmouseup = ()=>{
    // open rune info
    if(!board.currentRune) return;
    showRuneInfo(board.currentRune);
};


document.getElementById("runeSearch").addEventListener("input", loadRuneData);





// DPS test
import Calculate from "../../resources/modules/calculator/Calculate.js";

function calcDPS() {
    const calcData = Calculate();
    // route to stats after
}

document.getElementById("calculateBoardShortcut").addEventListener("click", () => {
    calcDPS()
})



/// EDIT RUNE

const editPopup = document.getElementById("editRunePopupOverlay");

function openEditPopup() {
    editPopup.style.display = "flex";
    console.log(board.lastPosition);
    if(board.lastPosition) {
        const rune = board.table[board.lastPosition[0]][board.lastPosition[1]];
        console.log(rune);
    }
}
function closeEditPopup() {
    editPopup.style.display = "none";
}
function updateEditRune() {

}
// listeners
document.getElementById("cancelEditRune").addEventListener("click", () => {
    closeEditPopup();
})
document.getElementById("saveEditRune").addEventListener("click", () => {
    updateEditRune();
    closeEditPopup();
})
document.getElementById("editRune").addEventListener("click", () => {
    openEditPopup();
})