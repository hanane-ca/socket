const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4 : uuidV4 } = require('uuid');

app.set('view engine','ejs');
app.use(express.static('public'));

app.get('/',(req,res) => {
  res.render('room', {roomId : 1});
});

app.get('/:room',(req,res) => {
  res.render('room', {roomId : req.params.room});
});


io.on('connection', socket => {
  socket.on('send-chat-message', message => {
    socke.broadcast.emit('chat-message', { message: message});
  });
  socket.on('join-room', (roomId,userId) => {
    socket.broadcast.emit('user-connected',userId);
    socket.on('disconnect',() => {
      socket.broadcast.emit('user-disconnected',userId);
    });
    
  });
});


server.listen(3000);