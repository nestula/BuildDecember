function getRuneByLevel(runeName, level) {
    const rune = structuredClone(window.allRunes.find(r => r.title === runeName));
    const level1 = rune.stats.level1;
    const level45 = rune.stats.level45;
    const stats = {};

    for (const prop in level45) {
        const val1 = level1[prop];
        const val45 = level45[prop];

        if (typeof val1 === "number" && typeof val45 === "number") {
            // Simple number interpolation
            const step = (val45 - val1) / 44;
            stats[prop] = parseFloat((val1 + step * (level - 1)).toFixed(2));
        } else if (Array.isArray(val1) && Array.isArray(val45)) {
            // Interpolate each number in the array
            stats[prop] = val1.map((v1, i) => {
                const v45 = val45[i];
                if (typeof v1 === "number" && typeof v45 === "number") {
                    const step = (v45 - v1) / 44;
                    return parseFloat((v1 + step * (level - 1)).toFixed(2));
                } else {
                    return v1; // non-number, copy as is
                }
            });
        } else {
            // Static values like strings ("Effect")
            stats[prop] = val1 || val45;
        }
    }

    rune.stats["currentLevel"] = stats;
    return rune;
}


export default getRuneByLevel;