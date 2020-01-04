var chatBody = document.getElementById("chatBody");
var tempMessage = '';
var messageTime = 2;
var tempWidth = 0;
var pxWidthPerLetter = 8;
var pxOffsetWidth = 6;
var pxHeightPerLine = 24;
var maxMessageWidth = 350;
var textPadding = "5px";
var bubbleSideMargin = "1.5vw";

function onEnter_sendMessage(event) {
    if (event.keyCode == 13)
        send_playerMessage();
}

function send_playerMessage() {
    var inputText = document.getElementById("inputField");
    tempMessage = String(inputText.value);
    inputText.value = '';
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

function create_bubble(textStr, isByPlayer) {
    var tempBubble = document.createElement("div");
    tempBubble.classList.toggle("messageBubble", true);
    tempBubble.innerHTML = textStr;
    set_size(tempBubble, tempBubble.innerHTML);
    set_direction(tempBubble, isByPlayer);
    document.getElementById("chatBody").appendChild(tempBubble);
}

function set_size(bubbleElement, text) {
    bubbleElement.style.width = String(calculate_width(text) + pxOffsetWidth + "px");
    bubbleElement.style.height = String(calculate_height() + "px");
}

function calculate_width(textStr) {
    tempWidth = pxWidthPerLetter * textStr.length;
    if (tempWidth > maxMessageWidth)
        return maxMessageWidth;
    return tempWidth;
}

function calculate_height() {
    return Math.ceil(tempWidth / maxMessageWidth) * pxHeightPerLine;
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
    if (tempMessage.includes("Sophie")) {
        document.getElementById("profileStatus").innerHTML = "<i>Writing...</i>";
        sleep(messageTime * 1000).then(() => {
            send_npcMessage();
            document.getElementById("profileStatus").innerHTML = "Online";
        })
    }
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function load_txtFile(fileName) {
    var txtFile = new XMLHttpRequest();
    txtFile.open("GET", "assets/txt/" + fileName + ".txt", true);
    txtFile.onreadystatechange = function () {
        if (txtFile.readyState === 4 && txtFile.status == 200) {
            content = txtFile.responseText;
        }
        return content;
    }
    txtFile.send(null);
}