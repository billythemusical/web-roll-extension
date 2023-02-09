console.log("running content.js script")

let speed = 1
let increment = 2
let intervalObj = null;
let retry = 0;

// Here we listen for a message to execute the scrolling
chrome.runtime.onMessage.addListener(handleRequest)

async function handleRequest(message, sender, sendResponse) {
        // console.log(sender.tab ? 
        //     `from a content script: ${sender.tab.url}` : "from the extension")
        if(message.speed) {
            speed = message.speed
            console.log(`speed value updated: ${speed}`)
        }
        if (message.start) {
            console.log("start message received")
            start()
        }
        // if (message.reset) {

        // }
        // sendResponse({ reply: "content script received the message" })
}

const clickHandler = () => {
    console.log("Clicked; stopping autoscroll");
    clearInterval(intervalObj);
    document.body.removeEventListener("click", clickHandler);
}

function start () {
    scrollDown()
    loopAndClickToStop()
}

// function reset() {
//     stop()
//     jumpToTop()
// }

// function stop() {
//     for (var i = 1; i < 99999; i++) window.clearInterval(i); // from https://stackoverflow.com/questions/958433/how-can-i-clearinterval-for-all-setinterval
//     document.body.removeEventListener("click", clickHandler);
// }

function scrollDown() { 
    console.log('running scrollDown')
    let scrollHeight = document.body.scrollHeight
     //from https://stackoverflow.com/questions/28633221/document-body-scrolltop-firefox-returns-0-only-js
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    let innerHeight = window.innerHeight
    let difference = (scrollHeight - scrollTop) - innerHeight
    const debugs = {
        "scrollHeight": scrollHeight,
        "scrollTop": scrollTop,
        "innerHeight": innerHeight,
        "difference": difference,
        "retry": retry,
        "intervalObj": intervalObj
    }
    console.table(debugs)

    if (difference > 0) { 
        window.scrollBy(0, 1);
        if (retry > 0) { 
            retry = 0;
        }
        console.log("scrolling down more");
    } else {
        if (retry >= 3) {
            console.log("reached bottom of page; stopping");
            stop()
            document.body.removeEventListener("click", clickHandler);
        } else {
            console.log("[apparently] hit bottom of page; retrying: " + (retry + 1));
            retry++;
        }
    }
}

function loopAndClickToStop() {
    document.body.addEventListener("click", clickHandler);
    intervalObj = setInterval(scrollDown, speed);
}

// function jumpToTop() {

// }