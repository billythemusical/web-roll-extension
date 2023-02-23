chrome.runtime.onMessage.addListener(handleMessage)

async function getTabId() {
	let queryOptions = { active: true, lastFocusedWindow: true }
	const [tab] = await chrome.tabs.query(queryOptions)
	if ('id' in tab) {
		return tab.id
	}
}

async function handleMessage(message) {
	if (message) {
		const tabId = await getTabId()
		chrome.tabs.sendMessage(tabId, message)
	}
}