const enterBtn = document.getElementById('enter');
const roomId = document.getElementById('room');


enterBtn.addEventListener('click', () => {
    var room = roomId.value;
    window.location.href = '/'+room;
    roomId.value = '';
})