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
    const awakeningData = document.getElementById("editRuneAwakeningData");
    awakeningData.innerHTML = "";

    if (awakening != "none" && editingRune) {
        document.getElementById("editRuneAwakeningData").innerHTML = "";
        const stats = editingRune.awakenings[awakening];
        for(const stat in stats) {
            const statDiv = document.createElement("div");
            if(stats[stat]) {
                statDiv.innerHTML = `${stat}: <span class="statAccent">${stats[stat]}</span>`;
            } else {
                statDiv.innerHTML = stat;
            }
            document.getElementById("editRuneAwakeningData").appendChild(statDiv);
        }
    }
}

document.getElementById("editRuneAwakeningDropdown").addEventListener("change", () => {
    const awakening = document.getElementById("editRuneAwakeningDropdown").value;
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