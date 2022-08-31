// Elements
let curUsernameInput = document.querySelector('#username');
const changeUsernameBtn = document.querySelector('#changeUsernameBtn');

// let findChatNameInput = document.querySelector('#chatName');
// let findChatBtn = document.querySelector('#AddchatBtn');

const chatList = document.querySelector('.chatList > ul');

// Variables
let curUsername = "";

// Attributes
const socket = io();

// Functions
function changeUsername() {
    let tmp = curUsernameInput.value;
    if (tmp.trim() === "" || !curUsernameInput.value) return;
    curUsername = tmp;
    console.log(curUsername);
    curUsernameInput.value = '';
    curUsernameInput.placeholder = curUsername;
    socket.emit("addChat", { chatName: curUsername });
}



// Event Listener
curUsernameInput.addEventListener('keyup', (e) => { if (e.keyCode === 13) changeUsername(); });
changeUsernameBtn.addEventListener('click', () => changeUsername());
// findChatNameInput.addEventListener('keyup', (e) => { if (e.keyCode === 13) Addchat(); });
// findChatBtn.addEventListener('click', () => Addchat());

class ChatItemModel{
    constructor(chatItem){
        this.chatItem = chatItem;
    }
    create() {
        let liTag = document.createElement('li');
        let aTag = document.createElement('a');
        aTag.href = `/chat?username=${this.chatItem}`;
        aTag.innerText = this.chatItem;
        liTag.appendChild(aTag);
        chatList.appendChild(liTag);
    }
}

// Page Initialize
socket.on("getChatList", (data) => {
    // destructuring data value
    const { chatList } = data;
    console.log(`chatList : ${chatList}`);
    // make model 
    for(let chatItem of chatList){
        const item = new ChatItemModel(chatItem);
        item.create();
    };
});

(() => {
    console.log("페이지요청안해?")
    socket.emit("showChatList", () => {
        console.log('페이지요청');
    });
})();

