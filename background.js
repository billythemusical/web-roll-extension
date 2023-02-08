let speed = 4

async function getTabId() {
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true}) 
    // console.log(`got tabId the first time: ${tab.id}`)
    return tab.id
}

chrome.runtime.onMessage.addListener(handleStart)

async function handleStart(request, sender, sendResponse) {
        if(request.message === "start_scroll") {
    
            const tabId = await getTabId()
            console.log(`got the new tab id: ${tabId}`) 
    
            const response = await chrome.tabs.sendMessage(tabId, { speed: request.speed })  
            console.log(`sent the speed: ${request.speed} w ${response.reply}`)
    
        }
}

// chrome.scripting
//             .executeScript({
//                 target: { tabId: tabId },
//                 files: ["scroll.js"]
//             })
//         .then(()=>console.log("ran the scroll I think"))