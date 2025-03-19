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

        let canLink = true;

        // console.log(conditions.any, rune1.tags);

        // satify any
        
        let hasAny = false;
        if(conditions.any) {
            for(const key of rune1.tags) {
                for(const check of conditions.any) {
                    if(key === check) {
                        hasAny = true;
                        break;
                    }
                }
            }
        }

        if(hasAny) {
            canLink = true;
        }

        // satisfy all

        if(conditions.all) {
            for(const check of conditions.all) {
                if(!rune1.tags.includes(check)) {
                    canLink = false;
                    break;
                }
            }
        }

        // excluded

        if(conditions.cannot) {
            for(const key of rune1.tags) {
                for(const check of conditions.cannot) {
                    if(key === check) {
                        canLink = false;
                        break;
                    }
                }
            }
        }
        
        return canLink;
    },
    canLink(rune1, rune2) {
        if (!window.allRunes) return false;
        if (!rune1 || !rune2) return false;
        if (rune1.type === rune2.type) return false; // same type check
    
        const skill = rune1.type === "skill" ? rune1 : rune2;
        const link = rune1.type === "link" ? rune1 : rune2;
        const conditions = link.conditions || {};
        const tags = skill.tags || []; // Ensure tags exist
    
        // Excluded conditions override everything
        if (conditions.cannot) {
            for (const check of conditions.cannot) {
                if (tags.includes(check)) {
                    return false; // Immediately return false if excluded tag is found
                }
            }
        }
    
        // Check 'any' condition
        let hasAny = false;
        if (conditions.any) {
            for (const check of conditions.any) {
                if (tags.includes(check)) {
                    hasAny = true;
                    break;
                }
            }
        }
    
        // Check 'all' condition
        let hasAll = true;
        if (conditions.all) {
            for (const check of conditions.all) {
                if (!tags.includes(check)) {
                    hasAll = false;
                    break;
                }
            }
        } else {
            hasAll = false;
        }
        // console.log(hasAny, hasAll);
        return hasAny || hasAll;
    }
    
}

export default RuneInfo;