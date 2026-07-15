// ======================================
// EVAN Dashboard
// ======================================

// UI Elements
const promptInput = document.getElementById("prompt");
const compareBtn = document.getElementById("compareBtn");

const chatgptResponse = document.getElementById("chatgpt-response");
const geminiResponse = document.getElementById("gemini-response");

// ======================================
// Compare Button
// ======================================

compareBtn.addEventListener("click", async () => {

    const prompt = promptInput.value.trim();

    if (prompt === "") {
        alert("Please enter a prompt.");
        return;
    }

    // Reset response boxes
    chatgptResponse.textContent = "Searching for ChatGPT...";
    geminiResponse.textContent = "Searching for Gemini...";

    // Ask background.js for AI tabs
    chrome.runtime.sendMessage(
        {
            type: "GET_AI_TABS"
        },
        (tabs) => {

            // -----------------------------
            // ChatGPT
            // -----------------------------

            if (tabs.chatgpt) {

                chrome.runtime.sendMessage(
{
    type: "SEND_TO_CHATGPT",
    tabId: tabs.chatgpt.id,
    prompt: prompt
},
(response) => {

    if (chrome.runtime.lastError) {

        chatgptResponse.textContent =
            "❌ " + chrome.runtime.lastError.message;

        console.error(chrome.runtime.lastError);

        return;
    }

    if (!response) {

        chatgptResponse.textContent =
            "❌ No response received.";

        return;
    }

    if (response.success) {

        chatgptResponse.textContent =
            "✅ " + response.message;

    } else {

        chatgptResponse.textContent =
            "❌ " + response.message;

    }

});
            } else {

                chatgptResponse.textContent =
                    "❌ ChatGPT tab is not open.";

            }

            // -----------------------------
            // Gemini
            // -----------------------------

            if (tabs.gemini) {

                geminiResponse.textContent =
                    "✅ Gemini tab found.\n\nReady to send prompt.";

            } else {

                geminiResponse.textContent =
                    "❌ Gemini tab is not open.";

            }

        });

});