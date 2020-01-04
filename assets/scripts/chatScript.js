var chatBody = document.getElementById("chatBody");
var tempMessage = '';
var messageCount = 0;
var letterSizePx = 10;
var maxMessageWidth = 200;

function onEnter_sendMessage(event) {
    if (event.keyCode == 13)
        send_message();
}

function send_message() {
    var inputText = document.getElementById("inputField");
    tempMessage = String(inputText.value);
    //tempMessage = load_text();
    create_bubble(tempMessage);
    inputText.value = '';
}

/*function load_text() {

}*/

function create_bubble(textStr) {
    var tempBubble = document.createElement("div");
    tempBubble.classList.toggle("messageBubble", true);
    tempBubble.innerHTML = textStr;
    tempBubble.style.width = String(calculate_width(textStr) + "px");
    tempBubble.style.height = String(calculate_height(textStr) + "px");
    document.getElementById("chatBody").appendChild(tempBubble);
}

function calculate_width(textStr) {
    var width = letterSizePx * textStr.length;
    if (width > maxMessageWidth)
        width = maxMessageWidth;
    return width;
}

function calculate_height(textStr) {
    return 30;
}

/*function calculate_topPosition(messageCount) {
    messageCount++;
    return messageCount * 30;
}*/