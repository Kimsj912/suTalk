// Elements
let curUsernameInput = document.querySelector('#username');
const changeUsernameBtn = document.querySelector('#changeUsernameBtn');

// let findChatNameInput = document.querySelector('#chatName');
// let findChatBtn = document.querySelector('#AddchatBtn');

const chatListNode = document.querySelector('.chatList > ul');

// Constants
const ALERT_NO_USERNAME = '본인의 사용자명을 입력해주세요.'
// Variables
let curUsername = "";

// Attributes
const socket = io();

// Functions
function checkUsernameIsExist() {
    let tmp = curUsernameInput.value;
    if (tmp.trim() === "" || !curUsernameInput.value) {
        alert(ALERT_NO_USERNAME);
        return null;
    }
    return tmp;
}
function changeUsername() {
    let tmp = checkUsernameIsExist();
    if (tmp === null) return;
    curUsername = tmp;
    console.log(curUsername);
    curUsernameInput.value = '';
    curUsernameInput.placeholder = curUsername;
    socket.emit("addChat", { chatName: curUsername });
}
function onChatItemClicked(e) {
    e.preventDefault();
    location.href = `/chat?username=${curUsername}&chatName=${e.target.innerText}`;
}


// Event Listener
curUsernameInput.addEventListener('keyup', (e) => { if (e.keyCode === 13) changeUsername(); });
changeUsernameBtn.addEventListener('click', () => changeUsername());

class ChatItemModel{
    constructor(chatItem){
        this.chatItem = chatItem;
    }
    create() {
        let liTag = document.createElement('li');
        let aTag = document.createElement('a');
        aTag.onclick = (e) => onChatItemClicked(e);
        aTag.innerText = this.chatItem;
        liTag.appendChild(aTag);
        chatListNode.appendChild(liTag);
    }
}

// Page Initialize
let chatListArr = new Set();
socket.on("getChatList", (data) => {
    // destructuring data value
    const { chatList } = data;
    // make model (if not exist)
    for (let chatItem of chatList) {
        if (chatListArr.has(chatItem)) continue;
        if(chatItem === curUsername) continue;
        const item = new ChatItemModel(chatItem);
        item.create();
        chatListArr.add(chatItem);
    };
});

// page Initialize ========================================================
(() => {
    console.log("페이지요청안해?")
    socket.emit("showChatList", () => {
        console.log('페이지요청');
    });
})();

