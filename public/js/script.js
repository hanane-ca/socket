const socket = io('http://localhost:3000')
var messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

socket.on('chat-message', data => {
  appendMessage(`${data.message}`, false)
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  if (message != '') {
    appendMessage(`${message}`, true)
    socket.emit('send-chat-message', message)
    messageInput.value = ''
  }
})

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
var usersList = document.querySelector("#users_list");


function successCallback(stream) {
  usersList.innerHTML += `
  <div class="card col-lg-3" style="height: 14.5rem;">
      <div class="camera">
          <video style="width:100%; height: 100%;" autoplay></video>
      </div>
      <div class="text-center text-muted p-3">
          Username
      </div>
  </div>
  `;
  var video = document.querySelector('video');
  video.srcObject = stream;
  video.play();
}

function errorCallback(error) {
  console.log("navigator.getUserMedia error: ", error);
}
navigator.getUserMedia(constraints, successCallback, errorCallback);


// disable video
var disableBtn = document.querySelector('#disable');
var on = true;
disableBtn.addEventListener('click', (e) => {
  var video = document.querySelector('video');
  if(on) {
    video.pause();
    on = false;
  } else {
    video.play();
    on = true;
  }
});