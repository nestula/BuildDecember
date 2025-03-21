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

