const RuneInfo = {
    canConnect(name1, name2) {
        const rune1 = window.allRunes.find(r => r.title === name1);
        const rune2 = window.allRunes.find(r => r.title === name2);
        const canLink = RuneInfo.canLink(rune1, rune2);
        
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