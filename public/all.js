import SearchRune from "./resources/modules/search.js";

import Board from "./resources/modules/Board.js";
const board = new Board(document.getElementById("board")); // Example usage

function addNavBar() {
    const navBar = document.createElement("div");
    navBar.setAttribute("style", `
        display: flex;
        justify-content: center;
        background-color: #333;
        padding: 10px 20px;
        position: fixed;
        width: 100%;
        top: 0;
        z-index: 1000;
    `);

    navBar.innerHTML = `
        <a href="#runeListContainer" class="nav-link">Runes</a>
        <a href="/pages/builder/builder.html" class="nav-link">Board</a>
    `;

    // Add a style for the individual nav links
    const style = document.createElement('style');
    style.innerHTML = `
        .nav-link {
            text-decoration: none;
            color: white;
            font-size: 18px;
            margin: 0 15px;
            padding: 10px;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }
        .nav-link:hover {
            background-color: #555;
        }
    `;
    document.head.appendChild(style);

    // Append the nav bar to the body
    document.body.appendChild(navBar);
}

addNavBar();