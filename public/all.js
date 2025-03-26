const DATA = {
    version: "0.1.5"
}



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
        left:0;
        user-select: none;
        z-index: 1000;
        font-weight: bold;
    `);

    const pageName = document.querySelector("title").textContent;

    const routes = {
        "Home": "../../index.html",
        "Builder": "/pages/builder/builder.html",
        "Runes": "/pages/runes/runes.html"
    }

    for(const name in routes) {
        const path = routes[name];
        const element = document.createElement("a");
        element.setAttribute("class", "nav-link");

        // dont route to same page
        if(name != pageName) {
            element.setAttribute("href", path);
        }

        element.textContent = name;

        navBar.appendChild(element);
    }


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

    // Set the padding-top of the body to the calculated height of the navbar
    function handleResize() {
        const navBarHeight = navBar.getBoundingClientRect().height;
        document.body.style.paddingTop = `${navBarHeight}px`;
    }

    window.addEventListener('resize', handleResize);
    handleResize();
}

addNavBar();

function addFooter() {
    const footer = document.createElement("div");
    footer.setAttribute("style", `
        display: flex;
        justify-content: space-around;
        align-items: center;
        background-color: #333;
        padding: 5px;
        position: fixed;
        width: 100%;
        bottom: 0;
        left:0;
        user-select: none;
        z-index: 1000;
        font-weight: bold;
    `);

    footer.innerHTML = `
        <a href="https://discord.gg/NgKqGnrUbT" class="discord-link">Join the discord</a>
        <h3>Version: ${DATA.version}</h3>
    `;

    document.body.appendChild(footer);
}

addFooter();

function addFonts() {
    const fonts = document.createElement('link');
    fonts.rel = "preconnect";
    fonts.href = "https://fonts.googleapis.com";
    document.head.appendChild(fonts);

    const fonts2 = document.createElement('link');
    fonts2.rel = "preconnect";
    fonts2.href = "https://fonts.gstatic.com";
    fonts2.crossOrigin = "crossorigin";
    document.head.appendChild(fonts2);

    const fonts3 = document.createElement('link');
    fonts3.rel = "stylesheet";
    fonts3.href = "https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap";
    document.head.appendChild(fonts3);
}

addFonts();

