console.log("running JS content")

let speed = 4
let increment = 2
let intervalObj = null;
let retry = 0;

// Here we listen for a message to execute the scrolling
chrome.runtime.onMessage.addListener(handleRequest)

async function handleRequest(message, sender, sendResponse) {
        if(message.speed) {
            speed = message.speed
            console.log("speed value updated", speed)
            sendResponse({reply: "speed received"})
        }
        if(message.start) {
            document.body.addEventListener("click", clickHandler);
            intervalObj = setInterval(scrollDown, speed);
            sendResponse({reply: "start received by scroll.js"})
        }
}


function scrollDown() { 
    let scrollHeight = document.body.scrollHeight,
        scrollTop = document.body.scrollTop,
        innerHeight = window.innerHeight,
        difference = (scrollHeight - scrollTop) - innerHeight

    if (difference > 0) { 
        window.scrollBy(0, increment);
        if (retry > 0) { 
            retry = 0;
        }
        console.log("scrolling down more");
    } else {
        if (retry >= 3) {
            console.log("reached bottom of page; stopping");
            clearInterval(intervalObj);
            document.body.removeEventListener("click", clickHandler);
        } else {
            console.log("[apparenty] hit bottom of page; retrying: " + (retry + 1));
            retry++;
        }
    }
}

function clickHandler () { 
    console.log("Clicked; stopping autoscroll");
    clearInterval(intervalObj);
    document.body.removeEventListener("click", clickHandler);
}