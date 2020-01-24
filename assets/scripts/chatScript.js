var chatBody;
var statusLine;
var inputText;
var onlineAfter = 3.5;
var tempInput = '';
var latestPlayerMessage;
var messageTime = 1.5;
var deleteTransitionTime = 2;
var pxWidthPerLetter = 11;
var pxOffsetWidth = 6;
var textPadding = "5px";
var bubbleSideMargin = "1.5vw";
var firstMessage = true;
var progressionInt = 1;
var maxSessionsInt = 4;
var isWriting = false;
var cooldown = false;
var cooldownTime = 1;
var inSession = false;
var solvedText = "Good work! You found it.";

//Start()-function, loading past messages (chatHistory.txt) and init session
window.onload = function start() {
    chatBody = document.getElementById("chatBody");
    statusLine = document.getElementById("profileStatus");
    inputText = document.getElementById("inputField");
    sleep(onlineAfter * 1000).then(() => {
        statusLine.innerHTML = "Online";
    });
    load_txtHistory();
    sleep(800).then(() => {
        set_scrollBar();
        inSession = true;
    });
}

//sleep, for timed animations
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

//chatWindow always scrolls to bottom after each message
function set_scrollBar() {
    var scrollBehavior;
    if (inSession)
        scrollBehavior = 'smooth';
    else
        scrollBehavior = 'auto';

    sleep(10).then(() => {
        chatBody.lastChild.scrollIntoView({
            behavior: scrollBehavior,
            inline: 'nearest',
            block: 'start'
        });
    });
}

function onEnter_sendMessage(event) {
    if (event.keyCode == 13)
        send_playerMessage();
}

//print message typed by player
function send_playerMessage() {
    if (!isWriting && progressionInt < maxSessionsInt + 1 && !spaces_only(inputText.value)) {
        tempInput = String(inputText.value);
        inputText.value = '';
        if (firstMessage) {
            create_timeStamp("Today");
            firstMessage = false;
        }
        create_bubble(tempInput, true);
    }
}

//checking, whether message has only spaces
function spaces_only(inputMessage) {
    var onlySpaces = true;
    for (var i = 0; i < inputMessage.length; i++) {
        if (inputMessage[i] != " ")
            onlySpaces = false;
    }
    return onlySpaces;
}

function create_timeStamp(timeStr) {
    var timestampBubble = create_divElement(timeStr, "timeBubble");
    chatBody.appendChild(timestampBubble);
}

//create message element
function create_bubble(textStr, isByPlayer) {
    var tempBubble = create_divElement(textStr, "messageBubble");
    set_size(tempBubble, tempBubble.innerHTML);
    set_direction(tempBubble, isByPlayer);
    chatBody.appendChild(tempBubble);
    if (isByPlayer && inSession) {
        //checking player's last message for keyword
        latestPlayerMessage = tempBubble;
        check_progression(progressionInt);
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
    bubbleElement.style.width = String(pxWidthPerLetter * text.length + pxOffsetWidth + "px");
}

//determining whether lates message should set to the left (as npc's message) or to the right (as player's message)
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

function check_progression(progressionInt) {
    if (progressionInt == 2)
        check_branchingSession(progressionInt, "caras gourmet");
    else
        load_txtChatSession(progressionInt);
}

//check message for an alternative keyword, if not found in previous .txt-file
function check_branchingSession(startSessionInt, primaryKeyword) {
    var tempProgressionInt = startSessionInt;
    if (tempInput.toLowerCase().includes(primaryKeyword))
        load_txtChatSession(tempProgressionInt + 1);
    else
        load_txtChatSession(tempProgressionInt);
}

//loading npc's message collection, after the player wrote a message
function load_txtChatSession(sessionInt) {
    var txtFile = new XMLHttpRequest();
    txtFile.open("GET", "assets/txt/session_" + String(sessionInt) + ".txt", true);
    txtFile.onreadystatechange = function () {
        if (txtFile.readyState === 4 && txtFile.status == 200)
            parse_chatSession(txtFile.responseText, sessionInt);
    };
    txtFile.send(null);
}

//checking, whether the player's last message contains a keyword or not
function parse_chatSession(txtContent, sessionInt) {
    var keywords = txtContent.split("KEYWORDS: [[")[1].split("]]")[0].split(", ");
    var npcMessages = txtContent.split("KEYWORDS: [[")[1].split("]]")[1].split(">> ");
    if (check_keyword(tempInput, keywords))
        npcReaction(npcMessages, sessionInt);
    else
        delete_playerMessage(latestPlayerMessage);
}

function check_keyword(message, keywords) {
    for (var element = 0; element < keywords.length; element++)
        if (message.toLowerCase().includes(keywords[element]))
            return true;
    return false;
}

//if keyword is contained: print npc's messages
function npcReaction(npcMessages, sessionInt) {
    isWriting = true;
    sleep(messageTime * 1000).then(() => {
        statusLine.innerHTML = "Online";
        send_npcMessages(npcMessages, 1);
        progressionInt = sessionInt + 1;
    });
}

function increase_progression(sessionInt) {
        
}


//recursive function: printing the npc's messages one after one
function send_npcMessages(messageArray, messageInt) {
    sleep(((messageTime - Math.random()) + (messageTime + Math.random())) * 500).then(() => {
        statusLine.innerHTML = "<i>Writing...</i>";
        if (messageInt < messageArray.length) {
            sleep((messageArray[messageInt].length) * 35).then(() => {
                create_bubble(messageArray[messageInt], false);
                send_npcMessages(messageArray, ++messageInt);
            });
        }
        else {
            isWriting = false;
            if (progressionInt == 5)
                document.getElementById("inputField").placeholder = solvedText;
            statusLine.innerHTML = "Online";
            sleep(onlineAfter * 1000).then(() => {
                statusLine.innerHTML = "";
            });
        }
    });
}

//if no keyword is contained: erase player's last message
function delete_playerMessage(elementBubble) {
    elementBubble.style.transitionDuration = String(deleteTransitionTime) + "s";
    elementBubble.style.transitionDelay = "1s";
    elementBubble.style.backgroundColor = "red";
    sleep(deleteTransitionTime * 1000).then(() => {
        elementBubble.style.opacity = 0;
        sleep(deleteTransitionTime * 1500).then(() => {
            elementBubble.remove();
        });
    });
}

//loading chatHistory.txt, which is the dialogue of the past days found in the chat above
function load_txtHistory() {
    var txtFile = new XMLHttpRequest();
    txtFile.open("GET", "assets/txt/history.txt", true);
    txtFile.onreadystatechange = function () {
        if (txtFile.readyState === 4 && txtFile.status == 200)
            parse_chatHistory(txtFile.responseText);
    };
    txtFile.send(null);
}

//determining, whether the chatHistory's messages belong to npc or player character
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

//determining chatHistory's dates for the timeBubbles
function get_passedDate(passedDaysInt) {
    var date = new Date();
    date.setDate(date.getDate() - passedDaysInt);
    return String(date.getDate()).padStart(2, '0') + '/' + String(date.getMonth() + 1).padStart(2, '0') + '/' + date.getFullYear();
}