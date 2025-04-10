function formatStr(str = "", args = [], colorize = false) {
    let i = 0;
    let formatted = str.replace(/#/g, () => {
        const val = args[i++];
        if (colorize) {
            return `<span class="statAccent">${val}</span>`;
        }
        return val;
    });

    return formatted;
}

export default formatStr; 