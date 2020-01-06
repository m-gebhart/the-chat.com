var chatBody;
var statusLine;
var inputText;
var onlineAfter = 5;
var tempInput = '';
var tempBubble;
var latestPlayerMessage;
var messageTime = 1;
var tempWidth = 0;
var pxWidthPerLetter = 10;
var pxOffsetWidth = 6;
var pxHeightPerLine = 24;
var textPadding = "5px";
var bubbleSideMargin = "1.5vw";
var firstMessage = true;
var sessionStarted = false;
var sessionOver = false;
var sessionProgression = 1;

window.onload = function start() {
    chatBody = document.getElementById("chatBody");
    statusLine = document.getElementById("profileStatus");
    inputText = document.getElementById("inputField");
    sleep(onlineAfter * 1000).then(() => {
        statusLine.innerHTML = "Online";
    })
    load_txtHistory();
    sleep(1000).then(() => {
        set_scrollBar()
        sessionStarted = true;
    })
}

function set_scrollBar() {
    sleep(10).then(() => {
        chatBody.lastChild.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'start' });
    })
}

function onEnter_sendMessage(event) {
    if (event.keyCode == 13)
        send_playerMessage();
}

function send_playerMessage() {
    if (statusLine.innerHTML != "<i>Writing...</i>" && !sessionOver && inputText.value != '') {
        tempInput = String(inputText.value);
        inputText.value = '';
        if (firstMessage)
            create_timeStamp("today");
        firstMessage = false;
        create_bubble(tempInput, true);
    }
}

function send_npcMessages(messageArray, messageInt) {
    statusLine.innerHTML = "<i>Writing...</i>";
    if (messageInt < messageArray.length) {
        sleep((messageArray[messageInt].length) * 100).then(() => {
            create_bubble(messageArray[messageInt], false);
            send_npcMessages(messageArray, ++messageInt);
        })
    }
    else {
        statusLine.innerHTML = "Online";
        sessionProgression++;
    }
}

function create_timeStamp(timeStr) {
    var timestampBubble = create_divElement(timeStr, "timeBubble");
    chatBody.appendChild(timestampBubble);
}

function create_bubble(textStr, isByPlayer) {
    tempBubble = create_divElement(textStr, "messageBubble");
    set_size(tempBubble, tempBubble.innerHTML);
    set_direction(tempBubble, isByPlayer);
    chatBody.appendChild(tempBubble);
    if (isByPlayer && sessionStarted) {
        latestPlayerMessage = tempBubble;
        load_txtChatSession(sessionProgression);
    }
    set_scrollBar();
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
        bubbleElement.classList.toggle("npcBubble", true);
        bubbleElement.style.marginLeft = bubbleSideMargin;
        bubbleElement.style.paddingLeft = textPadding;
    }
    else if (isByPlayer) {
        bubbleElement.classList.toggle("playerBubble", true);
        bubbleElement.style.marginRight = bubbleSideMargin;
        bubbleElement.style.paddingRight = textPadding;
    }
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function load_txtChatSession(sessionInt) {
    var txtFile = new XMLHttpRequest();
    txtFile.open("GET", "assets/txt/session_" + String(sessionInt) + ".txt", true);
    txtFile.onreadystatechange = function () {
        if (txtFile.readyState === 4 && txtFile.status == 200) {
            parse_chatSession(txtFile.responseText);
        }
    }
    txtFile.send(null);
}

function parse_chatSession(txtContent) {
    var keywords = txtContent.split(">> KEYWORDS: [[")[1].split("]]")[0].split(", ");
    var npcMessages = txtContent.split(">> KEYWORDS: [[")[1].split("]]")[1].split(">> ");
    if (check_keyword(tempInput, keywords))
        send_npcMessages(npcMessages, 1);
    else 
        latestPlayerMessage.style.backgroundColor = "red";
}

function check_keyword(message, keywords) {
    for (var element = 0; element < keywords.length; element++)
        if (message.includes(String(keywords[element])))
            return true;
    return false;
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
    var allMessages = txtContent.split(">>");
    for (var message = 1; message <= allMessages.length - 1; message++) {
        if (allMessages[message].includes("["))
            create_timeStamp(get_passedDate(parseInt(allMessages[message][3])));
        else if (allMessages[message].includes("> "))
            create_bubble(allMessages[message].substring(2, allMessages[message].length - 1), true);
        else
            create_bubble(allMessages[message].substring(0, allMessages[message].length - 1), false);
    }
}

function get_passedDate(passedDaysInt) {
    var date = new Date();
    date.setDate(date.getDate() - passedDaysInt)
    return String(date.getDate()).padStart(2, '0') + '/' + String(date.getMonth() + 1).padStart(2, '0') + '/' + date.getFullYear();
}