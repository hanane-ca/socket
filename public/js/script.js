const socket = io('/');
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
});


var messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

// var person = prompt("Please enter your name", "Username");
var person = 'username';
var users = [];

socket.on('chat-message', data => {
  appendMessage(`${data.message}`, false)
});

myPeer.on('open', id => {
  socket.emit('join-room', roomId, id);
});


socket.on('user-disconnected', userId => {
  console.log(userId);
  if(users[userId]) users[userId].close();
});

messageForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = messageInput.value;
  if (message != '') {
    appendMessage(`${message}`, true);
    socket.emit('send-chat-message', message);
    messageInput.value = '';
  }
});

function appendMessage(message, me) {
  const messageElement = document.createElement('div')
  messageElement.className = 'msg'
  me ? messageElement.className = 'me' : messageElement.className = 'others'
  messageElement.innerText = message
  messageContainer.append(messageElement)
  if (messageContainer.offsetHeight > 500) {
    messageContainer.style.overflowY = 'scroll';
  }
  messageContainer.scrollTop = messageContainer.scrollHeight
}

// video call
navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;
var constraints = {
  audio: false,
  video: true
};
var usersListGrid = document.querySelector("#users_list");
var myVideo = document.createElement('video');

// function createVideoElement(video, person) {
//   var divCard = document.createElement('div');
//   divCard.className = 'card col-lg-3';
//   divCard.style.height = '14.5rem';
//   var videoContainer = document.createElement('div');
//   videoContainer.className = 'camera';
//   videoContainer.append(video);
//   var divText = document.createElement('div');
//   divText.classList = 'text-center text-muted p-3';
//   divText.append(person);
//   divCard.append(videoContainer);
//   divCard.append(divText);
//   usersListGrid.append(divCard);
// }

function createVideoElement(video,person) {
  usersListGrid.append(video);
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  createVideoElement(video, person);
}

function errorCallback(error) {
  console.log("navigator.getUserMedia error: ", error);
}

navigator.mediaDevices.getUserMedia(constraints)
  .then(stream => {
    addVideoStream(myVideo, stream);

    myPeer.on('call', call => {
      var video = document.createElement('video');
      call.answer(stream);
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
      })
    });
    
    socket.on('user-connected', userId => {
      connectToNewUser(userId, stream);
    });
  }); 

function connectToNewUser(userId,stream) {
  const call = myPeer.call(userId,stream);
  var video = document.createElement('video');
  call.on('stream',userVideoStream => {
    addVideoStream(video,userVideoStream);
  });
  call.on('close', () => {
    video.remove();
  });
  users[userId] = call;
}

