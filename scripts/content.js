let speed = 1
let loopInterval = 1
let loopTimeoutObject = null
let scrolling = false
let retry = 0
let hideCursorOnScroll = true

updateAndComputeSpeed(speed)

chrome.runtime.onMessage.addListener(handleRequest)

async function handleRequest(message) {

	if (message.checkbox) {
		updateCursorSwitch(message.checkbox)
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

function startScroll() {
	if (hideCursorOnScroll) {
		scrolling = true
		toggleCursor()
	}
	loopTimeoutObject = setInterval(scrollDown, loopInterval)
	document.body.addEventListener('click', clickHandler)
}

function stopScroll() {
	scrolling = false
	toggleCursor()
	clearInterval(loopTimeoutObject)
	for (var i = 1; i < 99999; i++) window.clearInterval(i)
	document.body.removeEventListener('click', clickHandler)
	loopTimeoutObject = null
}

function scrollDown() { 
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
}

function jumpToTop() {
	window.scrollTo(0, 0)
}

function updateAndComputeSpeed(s) {
	speed = s
}

function updateCursorSwitch(checkboxValue) {
	hideCursorOnScroll = checkboxValue
}

function toggleCursor() {
	if (scrolling) {
		document.documentElement.style.height = '100%'
		document.body.style.height = '100%'
		document.body.style.cursor = 'none'
		const links = document.getElementsByTagName('a')
		for (let link of links) {
			link.style.cursor = 'none'
		}
	} else {
		document.body.style.cursor = 'default'
		const links = document.getElementsByTagName('a')
		for (let link of links) {
			link.style.cursor = 'default'
		}
	}
}
