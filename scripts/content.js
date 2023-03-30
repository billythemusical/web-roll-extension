let speed = 1
let loopInterval = 1
let loopTimeoutObject = null
let scrolling = false, prevScrolling = false
let retry = 0
let hideCursorOnScroll = true
let showInstructions = true

updateAndComputeSpeed(speed)

chrome.runtime.onMessage.addListener(handleRequest)

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function handleRequest(message) {

	if (message.showCursor) {
		hideCursorOnScroll = message.showCursor
	}
	if (message.showInstructions) {
		showInstructions = message.showInstructions
	}
	if(message.speed) {
		updateAndComputeSpeed(message.speed)
	}
	if (message.start) {
		stopScroll()
		updateAndComputeSpeed(speed)
		startScroll()
	}
	if (message.stop) {
		stopScroll()
	}
	if (message.reset) {
		stopScroll()
		jumpToTop()
	}
}

function clickHandler () {
	stopScroll()
}

async function startScroll() {
	if (showInstructions) {
		showModal()
		await sleep(5000)
	}
	
	if (hideCursorOnScroll) {
		scrolling = true
		toggleCursor()
	}
	loopTimeoutObject = setInterval(scrollDown, loopInterval)
	document.body.addEventListener('click', clickHandler)
}

function stopScroll() {
	scrolling = false
	prevScrolling = scrolling
	toggleCursor()
	clearInterval(loopTimeoutObject)
	for (var i = 1; i < 99999; i++) window.clearInterval(i)
	document.body.removeEventListener('click', clickHandler)
	loopTimeoutObject = null
}

function scrollDown() { 
	if (scrolling && !prevScrolling) {
		showModal()
		await sleep(1000 * 3)
	}
	let scrollHeight = document.body.scrollHeight
	let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
	let innerHeight = window.innerHeight
	let difference = (scrollHeight - scrollTop) - innerHeight

	if (difference > 0) { 
		const scrollOptions = {
			top: speed,
			left: 0
		}
		window.scrollBy(scrollOptions)
		if (retry > 0) { 
			retry = 0
		}
	} else {
		if (retry >= 3) {
			stopScroll()
			document.body.removeEventListener('click', clickHandler)
		} else {
			console.log('[apparently] hit bottom of page retrying: ' + (retry + 1))
			toggleCursor()
			retry++
		}
	}
	toggleCursor()
}

function jumpToTop() {
	window.scrollTo(0, 0)
}

function updateAndComputeSpeed(s) {
	speed = s
}

function toggleCursor() {
	const locked = document.pointerLockElement === document.body
	console.log(`locked? ${locked}`)
	if (scrolling && !locked) {
		document.body.requestPointerLock()
	} else if (!scrolling && locked) {
		document.body.exitPointerLock()
	}
}

/**
 * Modal Stuff
 */

// Create the modal element
var modal = document.createElement('div');
modal.setAttribute('id', 'modal');

var heading = document.createElement('h2');
heading.innerText = 'Directions';

var paragraph1 = document.createElement('p');
paragraph1.innerText = 'The screen will begin scrolling in 5 seconds.';

var paragraph2 = document.createElement('p');
paragraph2.innerText = 'Your mouse cursor will disappear for this time.';

var paragraph3 = document.createElement('p');
paragraph3.innerText = 'Press the Escape key (ESC) at any time to stop scrolling and bring the cursor back.';

modal.appendChild(heading);
modal.appendChild(paragraph1);
modal.appendChild(paragraph2);
modal.appendChild(paragraph3);

// Add the modal element to the document
document.body.appendChild(modal);

// Add CSS styles for the modal
var style = document.createElement('style');
style.innerHTML = `
  #modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 999;
    text-align: center;
    color: #fff;
    font-size: 2em;
    padding-top: 10%;
  }

  #modal h2 {
    font-size: 3em;
    margin-bottom: 1em;
  }
`;
document.head.appendChild(style);


function showModal() {
	// Show the modal
	modal.style.display = 'block';
}

function hideModal() {
	// Hide the modal and start scrolling after 5 seconds
	modal.style.display = 'none';
	document.body.style.overflow = 'hidden';
	document.documentElement.style.overflow = 'hidden';
}


// Stop scrolling and show the cursor when the Escape key is pressed
document.addEventListener('keydown', function (event) {
	if (event.key === 'Escape') {
		document.body.style.overflow = 'auto';
		document.documentElement.style.overflow = 'auto';
		stopScrolling()
	}
});



