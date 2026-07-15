// =======================================
// EVAN - ChatGPT Provider v2
// Milestone 3.1
// =======================================

console.log("EVAN ChatGPT Provider Loaded");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.type !== "PROMPT") {
        return;
    }

    console.log("Prompt received:", request.prompt);

    // Try a few selectors
    const inputBox =
        document.querySelector("#prompt-textarea") ||
        document.querySelector("textarea") ||
        document.querySelector('[contenteditable="true"]');

    if (!inputBox) {

        sendResponse({
            success: false,
            message: "Could not find ChatGPT input box."
        });

        return true;
    }

    // Highlight the input box
    inputBox.style.border = "3px solid lime";
    inputBox.style.borderRadius = "10px";

    console.log("Input box found!");

// Focus the editor
inputBox.focus();

// Select existing text (if any)
document.execCommand("selectAll", false, null);

// Insert the prompt
const inserted = document.execCommand(
    "insertText",
    false,
    request.prompt
);

console.log("Insert Success:", inserted);

// Wait 500ms so ChatGPT can change
// the Talk button into the Send button.
setTimeout(() => {

    const sendButton = document.querySelector("#composer-submit-button");

    if (!sendButton) {

        sendResponse({
            success: false,
            message: "Send button not found."
        });

        return;
    }

    sendButton.click();

    sendResponse({
        success: true,
        message: "Prompt sent successfully."
    });

}, 100);

return true;
sendResponse({
    success: true,
    message: "Prompt sent successfully."
});

return true;

});
