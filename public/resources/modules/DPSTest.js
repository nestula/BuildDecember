import CollectStats from "./CollectStats.js";

function DPSTest(data={}) {
    const stats = CollectStats(data);
    console.log(stats);
    // seperate data
    const table = data.table;

    // add stats from linking runes only to skill rune here
    const rune = {
        name: "",
        tags: ["Attack", "Strike", "Melee", "Physical"],
        stats: {
            "Physical DMG": 30
        }
    }

    let finalDPS = 0;

    let runeDMG = 0;
    runeDMG += stats["Physical DMG"]+stats["Attack DMG"]; // DMG +
    runeDMG *= 1+(stats["Attack DMG %"]+stats["Physical DMG %"])/100; // DMG %
    runeDMG *= 1+(rune.stats["Physical DMG"])/100; // Skill Multiplier
    // amps
    // runeDMG = runeDMG * amp% * amp% * amp%
 
    finalDPS = runeDMG;

    return finalDPS;
}

export default DPSTest;