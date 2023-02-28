chrome.runtime.onMessage.addListener(handleMessage)

async function getTabId() {
	let queryOptions = { active: true, lastFocusedWindow: true }
	const [tab] = await chrome.tabs.query(queryOptions)
	if (tab === undefined) {
		return false
	} else {
		if ('id' in tab) {
			return tab.id
		}
	}
}

async function handleMessage(message) {
	if (message) {
		console.log(message)
		try {
			const tabId = await getTabId()
			chrome.tabs.sendMessage(tabId, message)
		} catch (error) {
			console.error('Error sending message 👇🏼👇🏼👇🏼')
			console.log(error)
		}
		
	}
}