async function getRunes() {
    // fetch
    const fetchLink = "./RuneList.html";
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

    for (let i = 0; i < runeItems.length; i++) {
        const item = runeItems[i];
        const link = item.querySelector('a');
        const body = link.children[0];
        const title = body.children[2].textContent;
        const type = body.querySelector('[data-prop]').getAttribute('data-prop');
        runes[i] = {
            title: title,
            type: type
        }
    }
    


    // append
    document.body.appendChild(items);

    return runes;
}

console.log(getRunes());