"use strict" // js의 오류를 줄여나가는 방향의 일환?

// Attribute
const socket = io();
const username = document.querySelector("#username"); 

const chatList = document.querySelector(".chat");
const chatInput = document.querySelector("#newMessage > input[type*=text]");
const sendButton = document.querySelector("#newMessage > input[type*=submit]");

//  get  msgs from server
socket.on("chatting",(data)=>{
    // destructuring data value
    const {name, msg, time} = data;
    // make model 
    const item = new MessageModel(name, msg, time);
    item.create();
    // scroll to bottom
    chatList.scrollTo(0,chatList.scrollHeight);
})

// Obj - li tag model about chatting block
class MessageModel {
	constructor(name, msg, time) {
		this.name = name;
		this.msg = msg;
		this.time = time;

		// make speech bubble
		this.create = () => {
			// get nickname value
			const nickname = document.querySelector("#nickname");
			// make li tag
			const section = document.createElement("section");
			// Identifies whether sent or received
			section.classList.add(username.innerText === this.name? 'mine' : 'other');
			// make dom value
			const dom = `
            <div class="profileBox">
                <img
                    src="data:image/jpeg;base64,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" />
                <p class="username">${this.name}</p>
            </div>
            <div class="messageBox">
                <p class="message">${this.msg}</p>
                <p class="time">${this.time}</p>
            </div>`;
			// set dom value
			section.innerHTML = dom;
			// append li into chatlist
			chatList.appendChild(section);
		};
	}
}


// Event
sendButton.addEventListener("click", ()=> {
    const param = {
        name : document.querySelector("#username").innerText,
        msg : chatInput.value,
    }
    // 채널아이디, 내용 객체를 담아 소켓으로 보냄.
    socket.emit("chatting", param); 
    //입력창 초기화
    chatInput.value = ""; 
}
);
chatInput.addEventListener("keypress",(e)=>{ if(e.keyCode===13) send(); });