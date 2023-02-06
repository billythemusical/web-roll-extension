document.getElementById("start").addEventListener("click", function() {
    // Get the values of the interval and increment sliders
    var interval = document.getElementById("interval").value;
    var increment = document.getElementById("increment").value;
  
    // Send a message to the content script with the interval and increment values
    console.log('sending a message')
    chrome.runtime.sendMessage({
            interval: interval, 
            increment: increment, 
            message: "start_scroll"
    });
});

//   document.getElementById("stop").addEventListener("click", function() {
//     clearInterval(intervalObj);
//     document.body.removeEventListener("click", clickHandler);
// });


