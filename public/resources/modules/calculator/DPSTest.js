import CollectStats from "./CollectStats.js";

function DPSTest(data={}) {
    const stats = CollectStats(data);
    // seperate data
    const table = data.table;

    /*
        Formula:
            (DMG+ * DMG%) * Skill Multiplier% * (Amp1% * Amp2% * Amp3%...)
    */

    // add stats from linking runes only to skill rune here
    const tempRune= {
        name: "Quick Slash",
        tags: ["Attack", "Strike", "Melee", "Physical", "Shadow", "Weapon Range"],
        stats: {
            "Physical DMG %": 250,
            "Physical DMG": 80
        }
    }

    let finalDPS = 0;


    ///// CALCULATE tempRuneS /////

    for(let i=0; i<table.length; i++) { // loop y
        for(let j=0; j<table[i].length; j++) { // loop x
            const slot = table[i][j];
            if(slot) {
                const rune = window.allRunes.find(r => r.title == slot);
                if(!rune) continue;

                // DMG +
                let dmg = 0;
                const DMG = 0; // add damage + stats from links and stats
                dmg += DMG;
                // DMG %
                const x = 0 + 0 + 0; // add percents
                const DMGPercent = 1 + (x)/100; // dmg % from all dmg & runes
                dmg *= DMGPercent;
                // Skill Multiplier %
                const y = 0; // main skill mult
                const skillMult = 1+(y)/100; // apply skill multiplier
                dmg *= skillMult;
                // Amp %
                const amps = [];
                for(const amp of amps) {
                    dmg *= 1+amp/100;
                }


                finalDPS += dmg;
            }
        }
    }

    // stats["Physical DMG"] += tempRune.stats["Physical DMG"];


    // let tempRuneDMG = 0;
    // tempRuneDMG += stats["Physical DMG"]+stats["Attack DMG"]; // DMG +
    // tempRuneDMG *= 1+(stats["Attack DMG %"]+stats["Physical DMG %"])/100; // DMG %
    // // skill multiplier
    // tempRuneDMG *= 1+(tempRune.stats["Physical DMG %"])/100; // Skill Multiplier
    // amps
    // tempRuneDMG = tempRuneDMG * amp% * amp% * amp%
 
    // finalDPS = tempRuneDMG;

    // implement resistances
    // const dummyLevel = 2;
    // const dummy = {
    //     name: "Dummy",
    //     stats: {
    //         resistances: 
    //     }
    // }

    // Speed = weapon speed * attack/cast speed % * (amp1% * amp2% * amp3%...)
    // speed caps at 5.0
    // critRate = weapon crit rate * critical rate %
    // critchance = critRate / (1+dummyLevel*0.04)
    // tempRuneDMG *= (100+critDMG%)/100; // if crit


    const formattedData = {
        finalDPS: finalDPS | 0,
        stats: stats,
        // runeDPS -> per second
        // runeDMG -> per hit
        // EHP
        // EMana / mana
    }

    return formattedData;
}

export default DPSTest;