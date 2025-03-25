import subRoute from "./subRoute.js";
import Packer from "../../resources/modules/Packer.js";

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

