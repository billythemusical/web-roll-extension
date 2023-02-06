chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('got a message')
    if(request.message === "start_scroll") {
        console.log('got a message')
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(tabs[0].id, {file: "content.js"});
        });
    }
});