import getRuneByLevel from "./getRuneByLevel.js";
import { showRuneInfo } from "./builder.js";

/// EDIT RUNE

const editPopup = document.getElementById("editRunePopupOverlay");

let editingRune = false;

function openEditPopup() {
    editPopup.style.display = "flex";
    if(board.lastPosition) {
        // get rune
        const runeName = board.table[board.lastPosition[0]][board.lastPosition[1]];
        const runeData = board.tableData[board.lastPosition[0]][board.lastPosition[1]];
        const rune = window.allRunes.find(r => r.title == runeName);
        editingRune = rune;
        // set values
        document.getElementById("editRuneName").textContent = rune.title;
        document.getElementById("editRuneLevel").value = runeData.level || 1;
        // awakenings
        const awakeningDiv = document.getElementById("editRuneAwakeningDropdown");
        awakeningDiv.innerHTML = "<option value='none'>None</option>";
        for(const awakening in rune.awakenings) {
            const awakeningOption = document.createElement("option");
            awakeningOption.value = awakening;
            awakeningOption.textContent = awakening;
            awakeningDiv.appendChild(awakeningOption);
        }
        awakeningDiv.value = runeData.awakening || "none";
        showAwakeningStats(runeData.awakening || "none");
    }
}

function showAwakeningStats(awakening) {
    const awakeningData = document.getElementById("runeAwakeningStats");
    awakeningData.innerHTML = "";

    if (awakening != "none" && window.editingRune) {
        showRuneInfo(window.editingRune.title, board.lastPosition, true);
    }
}

document.getElementById("editRuneAwakeningDropdown").addEventListener("change", () => {
    const awakening = document.getElementById("editRuneAwakeningDropdown").value;
    if(!window.editingRune) return;
    window.board.tableData[window.board.lastPosition[0]][window.board.lastPosition[1]].awakening = awakening;
    showAwakeningStats(awakening);
})


function closeEditPopup() {
    editPopup.style.display = "none";
}
function updateEditRune() {
    const [y, x] = board.lastPosition;
    const newLevel = Math.min(Math.max(1, parseInt(document.getElementById("editRuneLevel").value)), 45);
    getRuneByLevel(document.getElementById("editRuneName").textContent, newLevel);
    board.tableData[y][x].level = newLevel;

    const newAwakening = document.getElementById("editRuneAwakeningDropdown").value;
    if(newAwakening == "none") {
        board.tableData[y][x].awakening = null;
    } else {
        board.tableData[y][x].awakening = newAwakening;
    }

    showRuneInfo(document.getElementById("editRuneName").textContent, [y, x], true);
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


// new 

function updateRuneLevel() {
    if(!window.editingRune) {
        showRuneInfo(document.getElementById("runeName").textContent, board.lastPosition, false);
        return;
    };
    const runeLevel = parseInt(document.getElementById("editRuneLevel").value);
    const newLevel = Math.min(Math.max(1, runeLevel), 45);
    board.tableData[board.lastPosition[0]][board.lastPosition[1]].level = newLevel;
    showRuneInfo(document.getElementById("runeName").textContent, board.lastPosition, true);
}
document.getElementById("editRuneLevel").addEventListener("change", () => {
    updateRuneLevel();
})
