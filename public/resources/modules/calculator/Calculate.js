import DPSTest from "./DPSTest.js";

function Calculate() {
    const DPSdata = {
        table: window.board.table
    }

    const data = DPSTest(DPSdata);


    console.log(data)

    return data;
}

export default Calculate;