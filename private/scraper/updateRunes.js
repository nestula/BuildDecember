// fs and updating json

const fetchTimeout = 70;

const fs = require("fs");
const { JSDOM } = require("jsdom");
const axios = require("axios");

// List of potential User-Agent strings
const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.0',
    'Mozilla/5.0 (Windows NT 6.3; rv:40.0) Gecko/20100101 Firefox/40.0'
];

// Function to get a random item from an array
function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

// Sleep function to introduce delay between requests
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchPage(url) {
    const headers = {
        'User-Agent': getRandomElement(userAgents), // Random User-Agent
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache'
    };
    
    try {
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        console.error("Error fetching HTML:", error);
        throw error;
    }
}

async function updateRunes() {
    try {
        console.log("Fetching HTML data...");
        const data = await fetchPage("https://undecember.thein.ru/en/runes");
        
        // Make DOM
        const mainDOM = new JSDOM(data);
        const mainDocument = mainDOM.window.document;

        // Remove unnecessary elements
        console.log("Removing unnecessary elements...");
        const elementsToRemove = mainDocument.querySelectorAll('script, link, head, style, meta');
        elementsToRemove.forEach(element => element.remove());

        // Create basic rune list
        console.log("Creating basic rune list...");
        const runeElementList = mainDocument.querySelectorAll('.content_list_item');
        const runes = new Array(runeElementList.length);
        for(let i = 0; i < runeElementList.length; i++) {
            runes[i] = {
                title: runeElementList[i].querySelector('a').textContent,
                stats: {}
                //url: `https://undecember.thein.ru${runeElementList[i].querySelector('a').getAttribute('href')}`
            };
        }

        // Find subpages
        console.log("Finding subpages...");
        const subPageLinks = mainDocument.querySelectorAll('.content_list_item a');
        const runePromises = [];
        const subPageHTML = [];

        // Function to fetch subpage data and handle it
        const fetchSubpageData = async (index) => {
            const link = subPageLinks[index];
            const subPageUrl = `https://undecember.thein.ru${link.getAttribute("href")}`;
            console.log(`${index} / ${subPageLinks.length} - ${subPageUrl}`);
            
            try {
     
                const subPageData = await fetchPage(subPageUrl);
                const subPageDOM = new JSDOM(subPageData);
                const subPageDocument = subPageDOM.window.document;
                const propData = subPageDocument.querySelector('[data-class="prop"]').textContent;

                // Store the result in the promises array and subPageHTML
                runePromises[index] = propData;
                subPageHTML[index] = subPageDocument.documentElement.innerHTML; // Save the entire HTML

            } catch (error) {
                console.error(`Failed to fetch ${subPageUrl}`, error);
                runePromises[index] = null; // Store null if there is an error
                subPageHTML[index] = null; // Store null if there is an error
            }
        };

        // Loop through the subpages with a delay between each request
        for (let currentIndex = 0; currentIndex < subPageLinks.length; currentIndex++) {
            await fetchSubpageData(currentIndex);
            // Add a delay of 1 second (1000ms) between requests
            await sleep(fetchTimeout); // Adjust the time (in ms) to a reasonable value to avoid rate limiting
        }

        // Log all the fetched subpages' innerHTML
        console.log("All fetched subpages HTML:");
        subPageHTML.forEach((html, index) => {
            if (html) {
                // Use JSDOM to parse the HTML of the subpage
                const subPageDOM = new JSDOM(html);
                const content = subPageDOM.window.document.getElementById("content");

                console.log(`${index + 1} / ${subPageLinks.length} - Processing ${runes[index].title}...`);

        
                if (content) { // Check if content exists //

                    const card = content.querySelector('[class^="Elem_card__"]');

                    // get image src
                    const imageTag = card.querySelector('[class^="Elem_image_icon__"]');
                    const iconName = imageTag.getAttribute("src").split('/').pop(); // Extract the image name, e.g., "icon.png"
                    runes[index].icon = iconName;

                    // Extract minimum rarity value
                    const minRarityElement = content.querySelector('[data-class="MinRarity"] span');
                    const minRarity = minRarityElement ? minRarityElement.textContent : "Unknown";
                    runes[index].minRarity = minRarity;

                    // get tags
                    const tags = content.querySelectorAll('[class^="Elem_card_tags_item__"]');
                    const tagList = [];
                    tags.forEach(tag => {
                        if(tag.textContent === "") return;
                        tagList.push(tag.textContent)
                    });
                    runes[index].tags = tagList;

                    // get description
                    const descriptions = content.querySelector('[class^="Elem_card_desc__"]')?.querySelectorAll('[data-class="prop"]');
                    let desc = "";
                    if(descriptions) {
                        for(let i = 0; i < descriptions.length; i++) {
                            const description = descriptions[i].textContent;
                            desc += description.replace("Удар", "");
                            desc += " ";
                        }
                    }
                    runes[index].description = desc;

                    // get weapon types
                    const weaponTypes = content.querySelectorAll('[data-class="WeaponType"] span');
                    const weaponTypeList = new Array(weaponTypes.length);
                    weaponTypes.forEach((type, i) => {
                        weaponTypeList[i] = type.textContent.replaceAll(/["',]/g, "");
                    });
                    if(weaponTypeList.length > 0) {
                        runes[index].weaponTypes = weaponTypeList;
                    }

                    // get main stat type
                    const statTag = card.querySelector('[class^="Elem_image_point__"]');
                    const stat = statTag.getAttribute("data-stat");
                    if(stat) {
                        runes[index].mainStat = stat;
                    }

                    function cleanContent(content) {
                        if (Array.isArray(content)) {
                            return content.filter(item => !item.includes("Удар"));
                        }
                        return [];
                    }

                    // get rune type
                    const typeElement = content.querySelector('[class^="Elem_card_desc__"]');
                    if(typeElement) { // Check if typeElement exists //
                        // get type
                        const typeText = typeElement ? typeElement.textContent : "Unknown";
                        const lowerCased = typeText.toLowerCase();
                        let type="skill";
                        if(lowerCased.includes("can be linked") || lowerCased.includes("cannot be linked")) {
                            type="link";
                        }
                        if(runes[index].title.toLowerCase().includes("activation")) {
                            type="link";
                        }
                        runes[index].type = type;
    
                        // get conditions
                        if(type === "link") {
                            const linkConditions = {};
                            const conditions = typeElement.querySelectorAll('[data-class="prop"]');
                            for(let i = 0; i < conditions.length; i++) {
                                const condition = conditions[i].textContent.toLowerCase();
                                let items = conditions[i].querySelector("span");
                                if(items) {
                                    items = items.textContent.split(", ");
                                } else {
                                    items = true;
                                }
    
                                
                               
                                if(condition.includes("cannot be linked with skills that satisfy")) {
                                    linkConditions["cannot"] = cleanContent(items);
                                }

                                if(condition.includes("must include all")) {
                                    linkConditions["all"] = cleanContent(items);
                                } else {
                                    if((condition.includes("that satisfy") && condition.includes("can "))) {
                                        linkConditions["any"] = cleanContent(items);
                                    }
                                }
                                // minions
                                if(condition.includes("applies to minions")) {
                                    linkConditions["minions"] = true;
                                }
                                runes[index].conditions = linkConditions;
                            }
                        }
        
                    }

                    // how to get
                    const howToGetElement = content.querySelector('[data-class="HowtoGet"]');
                    if(howToGetElement) {
                        const getMethods = howToGetElement.querySelectorAll("span");
                        const getMethodsList = [];
                        getMethods.forEach(getMethod => getMethodsList.push(getMethod.textContent));
                        runes[index].howToGet = getMethodsList;
                    }


                    // STATS

                    const tiles = content.querySelectorAll('[class^="Elem_card_tiles_col__"]');
                    for(let i=0; i<tiles.length; i++) {
                        const tile = tiles[i];
                        const tileContent = tile.textContent;
                        // level 1
                        
                        const resource = tile.querySelector('[class^="Elem_card_resource__"]');
                        const props = tile.querySelector('[class^="Elem_card_props__"]')?.children;
                        if(!props) continue;

                        // add props
                        const propList = {};
                        
                        for(let i=0; i<props.length; i++) {
                            const prop = props[i];
                            const propContent = prop.textContent;
                            const propValue = prop.querySelector("span");

                            if(propValue) { // normal stats
                                const textNodes = propContent.replaceAll(propValue.textContent, "").trim().replaceAll("  ", " ").replace(" s", "");
                                propList[textNodes] = propValue.textContent;
                            } else if(
                                propContent.includes("Physical Element") || 
                                propContent.includes("Fire Element") || 
                                propContent.includes("Poison Element") || 
                                propContent.includes("Lightning Element") || 
                                propContent.includes("Cold Element")
                            ) { // type
                                runes[index]["elementType"] = propContent.split(" ")[0];
                            } else { // effect label
                                propList[propContent] = "Effect";
                            }

                        }

                        if(i==0) {
                            runes[index]["stats"]["level1"] = propList;
                        } else if(i==1) {
                            runes[index]["stats"]["level45"] = propList
                        }

                        
                    }
                    const grade = content.querySelector("[class^=Elem_card_tiles_col2__]");
                    // get grade
                    // TODO here


                    // AWAKENINGS

                    const awakenings = content.querySelector('[class^="Elem_card_awakening__"]');
                    
        
                    // Save the extracted data to the runes array
                    // Optionally, store the cleaned HTML
                    // runes[index].html = content.innerHTML;


                    /// OVERRIDES ///
                    if(runes[index].title === "Use Count") {
                        runes[index].conditions.any = [
                            "Attack",
                            "Defence",
                            "Magic",
                            "Spell",
                            "Duration",
                            "Movement"          
                        ]
                    }
                    if(runes[index].title === "Reverse Time") { 
                        delete runes[index].conditions.cannot; // remove incorrect cannot
                        runes[index].conditions.any = [
                            "Movement"
                        ]
                    }

        
                } else {

                    console.log(`Subpage ${index + 1} doesn't have content.`);
                }
            } else {
                console.log(`Subpage ${index + 1} failed to load.`);
            }
        });

        // console.log("Scraped data:", runes);

        // Write the scraped data to a JSON file
        console.log("Writing to JSON file...");
        const jsonData = JSON.stringify(runes, null, 2);
        fs.writeFileSync('./public/RuneList.json', jsonData);
    } catch (error) {
        console.error("Error logging HTML data:", error);
    }
}

updateRunes();

module.exports = updateRunes;