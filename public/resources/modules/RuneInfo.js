const RuneInfo = {
    canConnect(name1, name2) {
        if(!window.allRunes) return false;
        // return false if either of them dont exist
        if(!name1 || !name2) return false;
        // set to lower case
        name1 = name1.toLowerCase();
        name2 = name2.toLowerCase();
        // find the runes
        const rune1 = window.allRunes.find(rune => rune.title.toLowerCase() === name1);
        const rune2 = window.allRunes.find(rune => rune.title.toLowerCase() === name2);
        // cannot find
        if(!rune1 || !rune2) return false;
        // same type
        if (rune1.type === rune2.type) {
            return false;
        }

        const skill = rune1.type === "skill" ? rune1 : rune2;
        const link = rune1.type === "link" ? rune1 : rune2;

        const conditions = link.conditions || {};
        console.log(conditions);

        let canLink = false;


        // satify any

        if(conditions.any) {
            for(const key of rune1.tags) {
                for(const check of conditions.any) {
                    if(key === check) {
                        canLink = true;
                        break;
                    }
                }
            }
        }
        
        // satisfy all

        // excluded
        
        return canLink;
    }
}

setTimeout(() => {
    console.log(RuneInfo.canConnect("Piercing Arrow", "Multishot"));
}, 1000);

export default RuneInfo;