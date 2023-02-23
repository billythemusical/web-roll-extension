const start = document.getElementById('start')
start.addEventListener('click', handleStart)

const stop = document.getElementById('stop')
stop.addEventListener('click', handleStop)

const reset = document.getElementById('reset')
reset.addEventListener('click', handleReset)

const speedSlider = document.getElementById('speed')
speedSlider.oninput = updateSpeed

updateSpeed()

function handleStart() { 
	chrome.runtime.sendMessage({ start: 'start' })
	chrome.extension.getViews({ type: 'popup' }).forEach(function (view) {
		view.close()
	})
}

function handleStop() {
	chrome.runtime.sendMessage({ stop: 'stop' })
}

function handleReset() {
	chrome.runtime.sendMessage({ reset: 'reset' })
}

function updateSpeed() {
	chrome.runtime.sendMessage({ speed: speedSlider.value })
}