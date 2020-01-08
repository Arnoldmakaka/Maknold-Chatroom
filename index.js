const express = require('express');
const socket = require('socket.io');

//App setup
const app = express();
const server = require('http').createServer(app);
const io = socket(server);

//Port setup
const port = process.env.PORT || 7000;

//Server setup
server.listen(port, () => {
	console.log(`Listening on port ${port}...`)
});

//Routing Files
app.use(express.static('docs'));

//Chatroom
let numOfUsers = 0;

io.on('connection', (socket) => {
	let addedUser = false;

  console.log(`made ${socket.id} connection`);

  socket.on('chat', (data) => {
    socket.emit('chat', data)
  });

  socket.on('broadchat', (data) => {
    socket.broadcast.emit('broadchat', data)
  });

  socket.on('adduser', (username) => {
    if (addedUser) return;
    socket.username = username.handle;
    ++numOfUsers;
    addedUser = true;
    socket.emit('login', {
      numOfUsers: numOfUsers
    });
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numOfUsers: numOfUsers
    });
  });
  
  socket.on('disconnect', () => {
    if (addedUser) {
      --numOfUsers;
      socket.broadcast.emit('user left', {
        username: socket.username,
      	numOfUsers: numOfUsers
    	});
  	}
	});
  	
});
