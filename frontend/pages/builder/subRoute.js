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

export default subRoute;