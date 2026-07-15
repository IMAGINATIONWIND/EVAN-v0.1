// ======================================================
// EVAN Background Service Worker
// ======================================================

// Opens the dashboard when the extension icon is clicked.
chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({
        url: chrome.runtime.getURL("dashboard.html")
    });
});

// ------------------------------------------------------
// Returns the ChatGPT and Gemini tabs (if open)
// ------------------------------------------------------

async function getAITabs() {
    const tabs = await chrome.tabs.query({});

    let chatgpt = null;
    let gemini = null;

   for (const tab of tabs) {

    console.log(
        "Tab:",
        tab.id,
        tab.title,
        tab.url
    );

    if (
        tab.url &&
        (
            tab.url.startsWith("https://chatgpt.com") ||
            tab.url.startsWith("https://chat.openai.com")
        )
    ) {
        console.log("✅ ChatGPT Found:", tab.id);

        chatgpt = tab;
    }

    if (
        tab.url &&
        tab.url.startsWith("https://gemini.google.com")
    ) {
        console.log("✅ Gemini Found:", tab.id);

        gemini = tab;
    }

}
    return {
        chatgpt,
        gemini
    };
}

// ------------------------------------------------------
// Listen for messages from dashboard
// ------------------------------------------------------

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    // --------------------------------------------
    // Dashboard asking which AI tabs are open
    // --------------------------------------------

    if (request.type === "GET_AI_TABS") {

        getAITabs().then(sendResponse);

        return true;
    }

    // --------------------------------------------
    // Forward prompt to ChatGPT
    // --------------------------------------------

    if (request.type === "SEND_TO_CHATGPT") {

        chrome.tabs.sendMessage(
            request.tabId,
            {
                type: "PROMPT",
                prompt: request.prompt
            },
            (response) => {
                sendResponse(response);
            }
        );

        return true;
    }

    // --------------------------------------------
    // Forward prompt to Gemini
    // --------------------------------------------

    if (request.type === "SEND_TO_GEMINI") {

        chrome.tabs.sendMessage(
            request.tabId,
            {
                type: "PROMPT",
                prompt: request.prompt
            },
            (response) => {
                sendResponse(response);
            }
        );

        return true;
    }

});