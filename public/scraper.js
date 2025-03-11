async function getRunes() {
    // fetch
    const fetchLink = "./resources/RuneList.html";
    const res = await fetch(fetchLink);
    const text = await res.text();

    // div
    const newDiv = document.createElement('div');
    newDiv.innerHTML = text;

    // clean
    const elementsToRemove = newDiv.querySelectorAll('meta, head, link, script, style, img, image');
    elementsToRemove.forEach(element => element.remove());

    const items = newDiv.querySelector('[data-type="items"]');
    const runeItems = items.querySelectorAll('.content_list_item')

    const runes = new Array(items.length);

    function findClass(element, name) {
        for(const child of element.children) {
            if(child.getAttribute("class").includes(name)) {
                return child;
            }
            if(child.children.length > 0) {
                return findClass(child, name);
            }
        }
        return null;
    };


    for (let i = 0; i < runeItems.length; i++) {
        const item = runeItems[i];
        const link = item.querySelector('a');
        const linkSrc = link.href;
        const body = link.children[0];
        const title = body.children[2].textContent;
        const type = body.querySelector('[data-prop]').getAttribute('data-prop');
        runes[i] = {
            title: title,
            type: type,
            link: linkSrc
        }
    

        // runes[i].description = findClass(runeDiv, 'description').textContent;
    }

    for(const rune of runes) {
        console.log(rune.link)
        try {
            const res = await fetch(rune.link);
            // "TypeError: Failed to fetch\n    at getRunes (http://127.0.0.1:5500/scraper.js:52:27)"

            const text = await res.text();
            const runeDiv = document.createElement('div');
            runeDiv.innerHTML = text;
            // const elements = runeDiv.querySelectorAll('.content_list_item');
            // const description = findClass(runeDiv, 'description').textContent;
        } catch(error) {
            console.error(error);
        }
        // https://undecember.thein.ru/en/runes/VitalStrike/
        // https://undecember.thein.ru/en/runes/ShoutOfTerror/
    } 
    


    // append
    document.body.appendChild(items);

    return JSON.stringify(runes);
}


// console.log(getRunes());


function loadRunes() {
    const link = "./resources/RuneList.json";
    fetch(link)
        .then(response => response.json())
        .then(data => console.log(data));
    
}

loadRunes()

