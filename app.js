// Modules=============================================================
// about ESModule 
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import path from 'path';
const __dirname = path.resolve();
// about firebase
// const config = require('./firebaseData.json');
import config from './firebaseData.json' assert {type: 'json'};
import * as firebase from "firebase/app";
import { getDatabase, ref, onValue,get, child, push, set, update } from 'firebase/database';
// about express
import http from "http"; 
import express from "express";
// about socket
import { Server } from "socket.io"; 
// about ...other
import moment from "moment";
import url from 'url'; 
import nunjucks from 'nunjucks';

// Declare Variables=====================================================
// Initialize Firebase
const fb = firebase.initializeApp(config);
const db = getDatabase(fb);

// Constant
const PORT = process.env.PORT || 5000;

// Connect Variable
const app = express();
const server = http.createServer(app); 
const io = new Server(server); 

// server basic settings
app.use(express.static(path.join(__dirname, "public")));
server.listen(PORT, () => console.log(`server is running... ${PORT}`));
app.set("view engine", "html");
nunjucks.configure({
    express: app,
    watch: true,
})
app.set("views", path.join(__dirname, "public"));

// Routes===============================================================
app.get('/', (req, res) => {
    res.render('index.html');
});

app.get('/chat', (req, res) => {
    console.log('username : ', req.query.username);
    // 쿼리스트링으로부터 분리
    let data = url.parse(req.url, true).query;
    // 닉네임 저장
    let { username, chatName } = data;
    console.log(`data : ${username, chatName}`);
    // chat으로 연결
    res.render('public/chat.html', { "username": username, "chatName": chatName });
});


// Socket===============================================================
/** get data from io(chat.js)*/  
io.on("connection", (socket) => {
    console.log("a user connected");
    /** 채팅 내용 */
    socket.on("messaging", (data)=>{
        const { chatName, username, msg } = data;
        console.log(data);
        if (!chatName) console.log("chatName is null");
        const newChat = { ...data, time: moment(new Date()).format("yyyy-MM-dd hh:mm") };
        
        push(ref(db, `chat/${username}/${chatName}`), newChat);
        get(child(ref(getDatabase()), `chat/${username}/${chatName}`)).then((snapshot) => { 
            if (snapshot.exists) {
                const chattings = Object.values(snapshot.val() ?? []);
                io.emit("messaging", {"chattings": chattings});
            } else {
                console.log('no data');
            }
        });
        // io.emit("messaging", newChat);
    });


    /** 채팅방 추가 */
    socket.on("addChat", (data) => {
        const { chatName } = data;
        set(ref(db, `chatList/${chatName}`), true);
        const dbRef = ref(getDatabase());
        get(child(dbRef, "chatList")).then((snapshot) => { 
            if (snapshot.exists) {
                const chatList = Object.keys(snapshot.val());
                io.emit("getChatList", {"chatList": chatList});
            } else {
                console.log('no data');
            }
        });

    });

    /**채팅방 리스트 불러오기 */
    socket.on("showChatList", () => { 
        console.log("showChatList");
        const dbRef = ref(getDatabase());
        get(child(dbRef, "chatList")).then((snapshot) => { 
            if (snapshot.exists) {
                const chatList = Object.keys(snapshot.val() ?? {});
                io.emit("getChatList", {"chatList": chatList});
            } else {
                console.log('no data');
            }
        });
    });

})