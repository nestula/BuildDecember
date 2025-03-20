const Packer = Object.freeze({
    compact:(data={}) => {
        let compactedData = "";

        // pack runes

        compactedData+="#"
        const table = data.table;
        for(let i=0; i<table.length; i++) { // loop y
            for(let j=0; j<table[i].length; j++) { // loop x
                const slot = table[i][j];
                if(slot) {
                    compactedData+=`${slot}-${i}-${j};`;
                }
            }
        }

        // order: runes

        console.log("unpacked: ", Packer.unpack(compactedData))

        return compactedData;
    },
    unpack: (str) => {
        const args = str.split("#");
        // table
        let table = [
            new Array(5),
            new Array(6),
            new Array(7),
            new Array(8),
            new Array(7),
            new Array(6),
            new Array(5),
        ];

        for(let index=0; index<args.length; index++) {
            const section = args[index];
            switch(index) {
                case 1: // RUNES
                    const runes = section.split(";")
                    for(const rune of runes) {
                        const splitRune = rune.split("-");
                        const title = splitRune[0];
                        const y = splitRune[1];
                        const x = splitRune[2];
                        if(table[y]) {
                            table[y][x]=title;
                        }
                    }
                break;
            }
        }

        
        
        return table;
    }
});

export default Packer;