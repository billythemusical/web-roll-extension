const start = document.getElementById('start')
start.addEventListener('click', handleStart)

const stop = document.getElementById('stop')
stop.addEventListener('click', handleStop)

const reset = document.getElementById('reset')
reset.addEventListener('click', handleReset)

const speedSlider = document.getElementById('speed')
speedSlider.oninput = updateState

const showInstructions = document.getElementById('showInstructions')
showInstructions.onclick = updateState

updateState()

function handleStart() { 
	updateState()
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

function updateState() {
	chrome.runtime.sendMessage({ 
		speed: speedSlider.value,
		showInstructions: showInstructions.checked
	})
}