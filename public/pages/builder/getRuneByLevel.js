function getRuneByLevel(runeName, level) {
    const rune = structuredClone(window.allRunes.find(r => r.title == runeName));
    const level1 = rune.stats.level1;
    const level45 = rune.stats.level45;
    const steps = {};
    for(const prop in level45) {
        // get step
        if(typeof level1[prop] == "number" && typeof level45[prop] == "number") {
            steps[prop] = (level45[prop] - (level1[prop] || 0)) / 44;
        }
    }

    const stats = {};
    for(const prop in level45) {
        if(typeof level1[prop] === "number" && typeof level45[prop] === "number") {
            stats[prop] = parseFloat((level1[prop] + steps[prop] * (level - 1)).toFixed(2)) 
        } else {
            stats[prop] = level1[prop];
        }
    }

    rune.stats["currentLevel"] = stats;
    return rune;
}

export default getRuneByLevel;