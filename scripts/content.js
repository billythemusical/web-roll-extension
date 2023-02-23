console.log("running content.js script")

let speed = 1 // default value
let loopInterval = 1 // milliseconds
let loopTimeoutObject = null // timeout ID to stop scrolling
let scrolling = false
let retry = 0
let hideCursorOnScroll = true
const debugScroll = false
const debugSpeed = true

updateAndComputeSpeed(speed)

// Here we listen for a message to execute the scrolling
chrome.runtime.onMessage.addListener(handleRequest)

async function handleRequest(message, sender, sendResponse) {
        // console.log('got a message:', message)
        // These messages have to match what's sent in popup.js
        if (message.checkbox) {
            // console.log('message about checkbox, value is:', message.checkbox)
            updateCursorSwitch(message.checkbox)
        }
        if(message.speed) {
            // console.log('message for speed, speed is:', message.speed)
            updateAndComputeSpeed(message.speed)
        }
        if (message.start) {
            stopScroll()
            updateAndComputeSpeed(speed)
            startScroll()
        }
        if (message.stop) {
            console.log('message to stop')
            stopScroll()
        }
        if (message.reset) {
            console.log('message to reset')
            stopScroll()
            jumpToTop()
        }
}

function clickHandler () {
    stopScroll()
}

function startScroll() {
    if (hideCursorOnScroll) {
        scrolling = true
        toggleCursor()
    }
    loopTimeoutObject = setInterval(scrollDown, loopInterval)
    document.body.addEventListener("click", clickHandler)
}

function stopScroll() {
    console.log('stopping scroll')
    scrolling = false
    toggleCursor()
    clearInterval(loopTimeoutObject)
    for (var i = 1; i < 99999; i++) window.clearInterval(i) // from https://stackoverflow.com/questions/958433/how-can-i-clearinterval-for-all-setinterval
    document.body.removeEventListener("click", clickHandler)
    loopTimeoutObject = null
}

function scrollDown() { 
    console.log('running scrollDown')
    let scrollHeight = document.body.scrollHeight
     //from https://stackoverflow.com/questions/28633221/document-body-scrolltop-firefox-returns-0-only-js
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    let innerHeight = window.innerHeight
    let difference = (scrollHeight - scrollTop) - innerHeight

    const scrollDebug = {
        "scrollHeight": scrollHeight,
        "scrollTop": scrollTop,
        "innerHeight": innerHeight,
        "difference": difference,
        "retry": retry,
        "loopTimeoutObject": loopTimeoutObject
    }
    if (debugScroll) console.table(scrollDebug)

    if (difference > 0) { 
        const scrollOptions = {
            top: speed,
            left: 0,
            // behavior: "smooth"
        }
        window.scrollBy(scrollOptions)
        if (retry > 0) { 
            retry = 0
        }
        // console.log("scrolling down more")
    } else {
        if (retry >= 3) {
            // console.log("reached bottom of page stopping")
            stopScroll()
            document.body.removeEventListener("click", clickHandler)
        } else {
            console.log("[apparently] hit bottom of page retrying: " + (retry + 1))
            retry++
        }
    }
}

function jumpToTop() {
    window.scrollTo(0, 0)
}

function updateAndComputeSpeed(s) {
    // chrome.storage.sync.set({ "scrollSpeed": value }).then(() => {
    //     console.log("Value is set to " + value);
    // });

    // let speedInt = s * 10
    // let cubicSpeed = (speedInt * speedInt) / 10
    // cubicSpeed = Math.ceil(cubicSpeed)
    // const speedDebug = {
    //     speedSlider: s,
    //     speedInt: speedInt,
    //     cubicSpeed: cubicSpeed,
    // }
    // if (debugSpeed) console.table(speedDebug)
    // speed = cubicSpeed
    console.log('speed updated', speed)
    speed = s
}

function updateCursorSwitch(checkboxValue) {
    hideCursorOnScroll = checkboxValue
}

function toggleCursor() {
    if (scrolling) {
        // Hide the cursor
        document.documentElement.style.height = "100%";
        document.body.style.height = "100%";
        document.body.style.cursor = 'none';
        // do all the 'a' tags as well
        const links = document.getElementsByTagName('a')
        for (let link of links) {
            link.style.cursor = 'none'
        }
    } else {
        document.body.style.cursor = 'default';
        const links = document.getElementsByTagName('a')
        for (let link of links) {
            link.style.cursor = 'default'
        }
    }
    
    
}
