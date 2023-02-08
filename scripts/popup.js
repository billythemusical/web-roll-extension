document.getElementById("start").addEventListener("click", handleStart)
document.getElementById("speed").addEventListener("oninput", updateSpeed);


function handleStart() {
    // Get the values of the interval and increment sliders
    const speed = document.getElementById("speed").value;  
    // Send a message to the content script with the interval and increment values
    console.log('sending a message')
    chrome.runtime.sendMessage({
            speed: speed, 
            message: "start_scroll"
    });
}

async function updateSpeed() {
    console.log('updating speed')
    // Get the values of the interval and increment sliders
    const speed = document.getElementById("speed").value;  
    const tabId = await getTabId()
    // Send a message to the content script with the speed value
    chrome.runtime.sendMessage(tabId, { speed: speed });
}

async function getTabId() {
    const [ tab ] = await chrome.tabs.query({active: true, lastFocusedWindow: true}) 
    return tab.id
}