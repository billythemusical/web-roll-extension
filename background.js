// Start listening for messages
chrome.runtime.onMessage.addListener(handleMessage)

// Start listening for key presses
chrome.commands.onCommand.addListener((command) => {
    console.log(`Command: ${command}`);
});

async function getTabId() {
    let queryOptions = { active: true, lastFocusedWindow: true }
    const [tab] = await chrome.tabs.query(queryOptions) 
    if ('id' in tab) { // from https://dmitripavlutin.com/check-if-object-has-property-javascript/
        return tab.id 
    }
}

async function handleMessage(message, sender, sendResponse) {

    if (message) {
        // Get the tabId first
        const tabId = await getTabId()
        const forward = await chrome.tabs.sendMessage(tabId, message)
    }
}