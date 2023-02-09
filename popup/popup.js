const start = document.getElementById("start")
start.addEventListener("click", handleStart)
const speedSlider = document.getElementById("speed")
speedSlider.oninput = updateSpeed


function handleStart() { 
    // Send a message to background.js 
    console.log('start button clicked, sending message')
    chrome.runtime.sendMessage({ start: "start" });
}

function updateSpeed() {
    console.log("speed slider changed, sending speed")
    // Send a message to the content script with the speed value
    chrome.runtime.sendMessage({ speed: speedSlider.value });
}