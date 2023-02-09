let speed = 4

// Start listening to changes
chrome.runtime.onMessage.addListener(handleMessage)

async function getTabId() {
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true}) 
    // console.log(`got tabId the first time: ${tab.id}`)
    return tab.id
}

async function handleMessage(message, sender, sendResponse) {

    // console.log(sender.tab ?
    //     `from a content script: ${sender.tab.url}` : "from the extension")

    // Get the tabId first
    const tabId = await getTabId()
    // console.log(`got the new tab id: ${tabId}`) 
    
    if (message.speed) {
        speed = message.speed
        // Forward the message to the content script
        const forward = await chrome.tabs.sendMessage( tabId, { speed: speed })
        // if ( forward.reply ) {
        //     console.log(`sent the speed: ${speed}\ngot reply: ${forward.reply}`)
        // } 
    }
    if(message.start) {
        start = message.start
        // Forward the message to the content script
        const forward = await chrome.tabs.sendMessage( tabId, { start: start })
        // if( forward.reply ) {
        //     console.log(`sent start\ngot reply: ${forward.reply}`)
        // }
    }
}