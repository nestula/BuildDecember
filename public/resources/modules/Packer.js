const Packer = Object.freeze({
    compact:(data={}) => {
        let compactedData = "";

        // pack runes

        compactedData+="#"
        const table = data.table;
        const tableData = data.tableData || {};
        for(let i=0; i<table.length; i++) { // loop y
            for(let j=0; j<table[i].length; j++) { // loop x
                const slot = table[i][j];
                const slotData = tableData[i][j];
                if(slot) {
                    // title, x, y
                    compactedData+=`${slot}-${i}-${j}`;
                    // data
                    if(slotData.level != 45) {
                        compactedData+=`-L${slotData.level}`;
                    }
                    if(slotData.awakening && slotData.awakening != "none") {
                        let suffix = "";
                        switch(slotData.awakening) {
                            case "verity": suffix = "v"; break;
                            case "source": suffix = "s"; break;
                            case "origin": suffix = "o"; break;
                        }
                        compactedData+=`-A${suffix}`;
                    }
                    // end
                    compactedData+=";";
                }
            }
        }

        

        // order: runes

        return compactedData;
    },
    unpack: (str) => {
        const unpackedData = {
            table: []
        }
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
        let tableData = [
            new Array(5),
            new Array(6),
            new Array(7),
            new Array(8),
            new Array(7),
            new Array(6),
            new Array(5),
        ]
        for(let i=0; i<tableData.length; i++) {
            for(let j=0; j<tableData[i].length; j++) {
                tableData[i][j] = {
                    level: 45,
                    awakening: false
                };
            }
        }

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
                        if(!table[y]) break;

                        table[y][x]=title;
                        
                        const data = splitRune.slice(2);
                        for(let i=0; i<data.length; i++) {
                            switch(data[i][0]) {
                                case "L":
                                    tableData[y][x].level = parseFloat(data[i].slice(1));
                                break;
                                case "A":
                                    const awakening = data[i].slice(1);
                                    switch(awakening) {
                                        case "v": tableData[y][x].awakening = "verity"; break;
                                        case "s": tableData[y][x].awakening = "source"; break;
                                        case "o": tableData[y][x].awakening = "origin"; break;
                                    }
                                break;
                            }
                        }
                    }
                break;
            }
        }
        unpackedData.table = table;
        unpackedData.tableData = tableData;
        
        console.log(`Unpacked data:`, unpackedData);

        return unpackedData;
    }
});

export default Packer;