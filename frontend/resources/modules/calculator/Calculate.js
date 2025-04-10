import DPSTest from "./DPSTest.js";

function Calculate() {
    const DPSdata = {
        table: window.board.table,
        runes: window.board.calculatedRunes
    }

    const data = DPSTest(DPSdata);


    console.log("in",DPSdata,"out",data)

    return data;
}

export default Calculate;