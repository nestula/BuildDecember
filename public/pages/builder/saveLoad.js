import subRoute from "./subRoute.js";
import Packer from "../../resources/modules/Packer.js";
import SVGHandler from "../../resources/modules/SVGHandler.js";

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
            alert("That is not in the right format!")
        }
    }
    subRoute("boardRoute");
}



document.getElementById("loadButton").addEventListener("click", () => {
    loadJSON();
})
document.getElementById("clearLoad").addEventListener("click", () => {
    document.getElementById("loadBox").value = "";
})

// local saving


function saveStorage() {
    SVGHandler.cueLoader(800);
    const data = Packer.compact({
        table: board.table,
        tableData: board.tableData
    })
    localStorage.setItem("buildData", data);
}

document.getElementById("saveBoard").addEventListener("click", () => {
    saveStorage();
})

setInterval(()=>{
    saveStorage();
},10000)

function loadLocalStorage() {
    const data = localStorage.getItem("buildData");
    if(!data) {
        alert("No data found in storage (Save localStorage first)");
        return;
    };
    const unpackedData = Packer.unpack(data);
    board.table = unpackedData.table;
    board.tableData = unpackedData.tableData;
    subRoute("boardRoute");
}
if(localStorage.getItem("buildData")) {
    loadLocalStorage();
}
// compact saving 
document.getElementById("saveCompact").addEventListener("click", () => {
    const table = board.table;
    const tableData = board.tableData;
    const compactedData = Packer.compact({
        table,
        tableData
    })
    copy(compactedData);
})





// window.addEventListener('beforeunload', function(event) {
//     // The preventDefault() method cancels the event if it is cancelable, meaning that the default action that belongs to the event will not occur.
//     event.preventDefault();
//     // Included for legacy compatibility. Will be ignored by modern browsers.
//     event.returnValue = '';
//     // Customize the confirmation message (Optional)
//     return 'Are you sure you want to leave this page? You may want to save to localStorage before.';
// });

