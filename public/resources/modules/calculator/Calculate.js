import DPSTest from "./DPSTest.js";

function Calculate() {
    const DPSdata = {
        table: window.board.table,
        runes: window.board.calculatedRunes
    }

    const data = DPSTest(DPSdata);


    console.log(DPSdata,data)

    return data;
}

export default Calculate;