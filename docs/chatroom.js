//Make connection
const socket = io();

//Query DOM
let message = document.getElementById('message');
let btn = document.getElementById('send');
let innerchat = document.getElementById('inner-chat');

//Returning userhandle and declaring variables
let username = localStorage.getItem("userhandle");
let connected = false;

window.onload = function onReady() { 
    let username = localStorage.getItem("userhandle");
    document.getElementById('welcomeMessage').innerHTML = `<p class="join">Welcome to the chatroom, ${username}</p>`
    
    socket.emit('adduser', {
        handle: username
    });
}

//Emit events
btn.addEventListener('click', () => {

    if (message.value != "") {
        socket.emit('chat', {
            message: message.value
        });

        socket.emit('broadchat', {
            message: message.value,
            handle: username
        });

    } else {
        swal({
            title: "Oops!",
            text: "Did you forget to type a message",
            icon: "error",
        });
    }
});

//Helper Functions
const log = (message) => {
    let text = `<li><p class="join">${message}</p></li>`
    let position = "beforeend"
    innerchat.insertAdjacentHTML(position, text);
}

const addParticipantsMessage = (data) => {
    let message = '';
    if (data.numOfUsers === 1) {
      message += `You are the only participant`;
    } else {
      message += `There are ${data.numOfUsers} participants`;
    }
    log(message);
}

//Listen for events
socket.on('chat', (data) => {
    let text = `<li><div id="inneroutput"><div id="online"></div><p>${data.message}</p></div></li>`
    let position = "beforeend"
    innerchat.insertAdjacentHTML(position, text);
});

socket.on('broadchat', (data) => {
    let name = (data.handle);
    let text = `<li><div id="innerfeedback"><div id="userhandle"><div id="useronline"></div><h6>${name}</h6></div><p>${data.message}</p></div></li>`
    let position = "beforeend"
    innerchat.insertAdjacentHTML(position, text);
});

socket.on('reconnect_error', () => {
    log('Attempt to reconnect has failed');
});

socket.on('disconnect', () => {
    log('You have been disconnected');
});

socket.on('reconnect', () => {
    log('You have been reconnected successfully');
    if (username) {
      socket.emit('adduser', username);
    }
});

socket.on('user left', (data) => {
    log(`${data.username} lost connection`);
    addParticipantsMessage(data);
});

socket.on('user joined', (data) => {
    log(`${data.username} has joined the chatroom`);
    addParticipantsMessage(data);
});

socket.on('login', (data) => {
    connected = true;
    addParticipantsMessage(data);
});