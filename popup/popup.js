const start = document.getElementById("start")
start.addEventListener("click", handleStart)

const stop = document.getElementById("stop")
stop.addEventListener("click", handleStop)

const reset = document.getElementById("reset")
reset.addEventListener("click", handleReset)

const speedSlider = document.getElementById("speed")
speedSlider.oninput = updateSpeed

// const cursorCheckbox = document.getElementById("cursorCheckbox")
// cursorCheckbox.addEventListener("change", updateCheckbox)
// let checkboxVal = cursorCheckbox.checked
// console.log('check box is checked:', checkboxVal)

updateSpeed()

function handleStart() { 
    // Send a message to background.js 
    console.log('start button clicked, sending message')
    chrome.runtime.sendMessage({ start: "start" });
    chrome.extension.getViews({ type: "popup" }).forEach(function (view) {
        view.close();
    });
}

function handleStop() {
    // Send a message to background.js 
    console.log('reset button clicked, sending message')
    chrome.runtime.sendMessage({ stop: "stop" });
}

function handleReset() {
    // Send a message to background.js 
    console.log('reset button clicked, sending message')
    chrome.runtime.sendMessage({ reset: "reset" });
}

// function updateCheckbox(el) {
//     // Send a message to background.js 
//     checkBoxVal = el.currentTarget.checked
//     console.log('checkbox clicked, sending message', checkBoxVal)
//     chrome.runtime.sendMessage({ checkbox: checkBoxVal });
// }

function updateSpeed() {
    console.log("speed slider changed, sending speed")
    // Send a message to the content script with the speed value
    chrome.runtime.sendMessage({ speed: speedSlider.value });
}