import CollectStats from "./CollectStats.js";

function DPSTest(data={}) {
    const stats = CollectStats(data);
    console.log(stats);
    // seperate data
    const table = data.table;

    /*
        Formula:
            (DMG+ * DMG%) * Skill Multiplier% * (Amp1% * Amp2% * Amp3%...)
    */

    // add stats from linking runes only to skill rune here
    const rune = {
        name: "Quick Slash",
        tags: ["Attack", "Strike", "Melee", "Physical", "Shadow", "Weapon Range"],
        stats: {
            "Physical DMG %": 250,
            "Physical DMG": 80
        }
    }

    stats["Physical DMG"] += rune.stats["Physical DMG"];

    let finalDPS = 0;

    let runeDMG = 0;
    runeDMG += stats["Physical DMG"]+stats["Attack DMG"]; // DMG +
    runeDMG *= 1+(stats["Attack DMG %"]+stats["Physical DMG %"])/100; // DMG %
    // skill multiplier
    runeDMG *= 1+(rune.stats["Physical DMG %"])/100; // Skill Multiplier
    // amps
    // runeDMG = runeDMG * amp% * amp% * amp%
 
    finalDPS = runeDMG;

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
    // runeDMG *= (100+critDMG%)/100; // if crit

    return finalDPS;
}

export default DPSTest;