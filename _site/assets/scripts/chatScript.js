var chatBody;
var statusLine;
var tempMessage = '';
var messageTime = 2;
var tempWidth = 0;
var pxWidthPerLetter = 10;
var pxOffsetWidth = 6;
var pxHeightPerLine = 24;
var textPadding = "5px";
var bubbleSideMargin = "1.5vw";
var firstMessage = true;

window.onload = function start() {
    chatBody = document.getElementById("chatBody");
    statusLine = document.getElementById("profileStatus");
    load_txtHistory();
    chatBody.scrollTo({ top: "100vh" });
}

function onEnter_sendMessage(event) {
    if (event.keyCode == 13)
        send_playerMessage();
}

function send_playerMessage() {
    var inputText = document.getElementById("inputField");
    tempMessage = String(inputText.value);
    inputText.value = '';
    if (firstMessage)
        create_timeStamp("today");
    firstMessage = false;
    create_bubble(tempMessage, true);
    check_recentMessage();
}

function send_npcMessage() {
    var textStr = load_text();
    create_bubble(textStr, false);
}

function load_text() {
    return "Hey, man, long time no see! how are you?";
}

function create_timeStamp(timeStr) {
    var timestampBubble = create_divElement(timeStr, "timeBubble");
    chatBody.appendChild(timestampBubble);
}

function create_bubble(textStr, isByPlayer) {
    var tempBubble = create_divElement(textStr, "messageBubble");
    set_size(tempBubble, tempBubble.innerHTML);
    set_direction(tempBubble, isByPlayer);
    chatBody.appendChild(tempBubble);
}

function create_divElement(textStr, cssClass) {
    var divElement = document.createElement("div");
    divElement.classList.toggle(cssClass, true);
    divElement.innerHTML = textStr;
    return divElement;
}

function set_size(bubbleElement, text) {
    bubbleElement.style.width = String(calculate_width(text) + pxOffsetWidth + "px");
    bubbleElement.style.height = String(calculate_height(bubbleElement) + "px");
}

function calculate_width(textStr) {
    return pxWidthPerLetter * textStr.length;
}

function calculate_height(element) {
    return Math.ceil(element.style.maxWidth / element.style.width) * pxHeightPerLine;
}

function set_direction(bubbleElement, isByPlayer) {
    if (!isByPlayer) {
        bubbleElement.style.float = "left";
        bubbleElement.style.marginRight = "100%";
        bubbleElement.style.marginLeft = bubbleSideMargin;
        bubbleElement.style.backgroundColor = "white";
        bubbleElement.style.textAlign = "left";
        bubbleElement.style.paddingLeft = textPadding;
    }
    else if (isByPlayer) {
        bubbleElement.style.float = "right";
        bubbleElement.style.marginLeft = "100%";
        bubbleElement.style.marginRight = bubbleSideMargin;
        bubbleElement.style.backgroundColor = "rgb(140, 251, 162)";
        bubbleElement.style.textAlign = "right";
        bubbleElement.style.paddingRight = textPadding;
    }
}

function check_recentMessage() {
    if (tempMessage.includes("ophie")) {
        statusLine.innerHTML = "<i>Writing...</i>";
        sleep(messageTime * 1000).then(() => {
            send_npcMessage();
            statusLine.innerHTML = "Online";
        })
    }
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function load_txtFile(fileName) {
    var txtFile = new XMLHttpRequest();
    txtFile.open("GET", "assets/txt/" + String(fileName), true);
    txtFile.onreadystatechange = function () {
        if (txtFile.readyState === 4 && txtFile.status == 200) {
            content = txtFile.responseText;
        }
    }
    txtFile.send(null);
}

function load_txtHistory() {
    var txtFile = new XMLHttpRequest();
    txtFile.open("GET", "assets/txt/history.txt", true);
    txtFile.onreadystatechange = function () {
        if (txtFile.readyState === 4 && txtFile.status == 200)
            parse_chatHistory(txtFile.responseText);
    }
    txtFile.send(null);
}

function parse_chatHistory(txtContent) {
    //chatBody.innerHTML = txtContent;
    var allMessages = txtContent.split(">>");
    for (var message = 1; message <= allMessages.length - 1; message++) {
        if (allMessages[message].includes("["))
            create_timeStamp(allMessages[message].substring(2, allMessages[message].length - 3));
        else if (allMessages[message].includes("> "))
            create_bubble(allMessages[message].substring(2, allMessages[message].length - 1), true);
        else
            create_bubble(allMessages[message].substring(0, allMessages[message].length - 1), false);

    }
}