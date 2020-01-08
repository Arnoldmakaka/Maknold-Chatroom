//Make connection
const socket = io();

//Query DOM
let handle = document.getElementById('handle');
let nxtbtn = document.getElementById('next');

//Emit event
nxtbtn.addEventListener('click', () => {
    if (handle.value != "") {
        localStorage.setItem("userhandle", handle.value.trim());
        setTimeout(function() { window.location.replace('chat.html'); }, 1500);
        swal({
            title: `Hey ${handle.value.trim()}`,
            text: `Welcome to the Maknold chatroom`,
            icon: "success",
        });
    }
    else {
        swal({
            title: "Oops!",
            text: "Did you forget to input your nickname",
            icon: "error",
        });
    }
});