function CollectStats(data={}) {
    // seperate data
    const table = data.table;

    // to be added
    const gear = {
        weapon: {
            name: "Sword",
            stats: {
                "Attack DMG": 25,
            }
        }
    }

    // init variables
    const stats = {
        // DMG +
        "Attack DMG": 0,
        "Spell DMG": 0,
        "Physical DMG": 0,
        "Fire DMG": 0,
        "Cold DMG": 0,
        "Lightning DMG": 0,
        "Poison DMG": 0,
        "Strike DMG": 0,
        "Mellow DMG": 0,
        "Projectile DMG": 0,
        // DMG %
        "Attack DMG %": 0,
        "Spell DMG %": 0,
        "Physical DMG %": 0,
        "Fire DMG %": 0,
        "Cold DMG %": 0,
        "Lightning DMG %": 0,
        "Poison DMG %": 0,
        "Strike DMG %": 0,
        "Mellow DMG %": 0,
        "Projectile DMG %": 0
    }

    ///// DMG + //////

    // gear
    for(const itemName in gear) { // loop through gear
        const item = gear[itemName];
        for(const stat in item.stats) { // loop through stats
            if(Object.prototype.hasOwnProperty.call(stats, stat)) {
                stats[stat] += item.stats[stat]; // add stat to stats
            }
        }
    }


    

    return stats;
}

export default CollectStats;