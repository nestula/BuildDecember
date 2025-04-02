// Flag to keep track of whether the user wants to ignore future errors
let ignoreErrors = false;

// Function to create and display the popup
function showErrorPopup(message, source, lineno, colno) {
    if (ignoreErrors) return;  // Don't show the popup if errors are being ignored

    const popup = document.createElement('div');
    popup.setAttribute("style", `
        position: fixed;
        top: 10px;
        right: 10px;
        background-color:rgb(138, 39, 32);
        color: white;
        padding: 10px;
        max-width: 500px;
        border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        font-size: 14px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        justify-content: center;
    `);


    const infoText = document.createElement('h3');
    infoText.textContent = `Oops! You've encountered an error. Please report this to the developer through the discord and include the following information:`;
    popup.appendChild(infoText);
    
    const messageText = document.createElement('p');
    messageText.setAttribute("style", `font-decoration: underline; background: #333; padding:5px;`); 
    messageText.textContent = `Error: ${message} at ${source}:${lineno}:${colno}`;
    popup.appendChild(messageText);

    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy to Clipboard';
    copyButton.onclick = function () {
        navigator.clipboard.writeText(messageText.textContent);
        alert('Copied to clipboard! Thank you for reporting the error.');
    };
    popup.appendChild(copyButton);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.onclick = function () {
        document.body.removeChild(popup);
    };
    popup.appendChild(closeButton);

    const ignoreButton = document.createElement('button');
    ignoreButton.textContent = 'Ignore & Don\'t Show Again';
    ignoreButton.onclick = function () {
        ignoreErrors = true;
        document.body.removeChild(popup);
    };
    popup.appendChild(ignoreButton);

    // Add the popup to the document
    document.body.appendChild(popup);
}

// Global error handler
window.onerror = function (message, source, lineno, colno, error) {
    showErrorPopup(message, source, lineno, colno);
    return false;  // Prevent the default browser error handling
};
