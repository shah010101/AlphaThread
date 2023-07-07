const socket = io("http://localhost:8000");

// Wait for the DOM to load before accessing elements
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('send-container');
  const messageInput = document.getElementById('messageInp');
  const messageContainer = document.querySelector('.container');
  var audio=new Audio('ting.mp3');
  const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);

    if(position=='left'){
        audio.play();
    }
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
    scrollToBottom();
  });


  const name = prompt("Enter your name");
  socket.emit('new user', name);

  socket.on('user joined', (name) => {
    append(`${name} joined the chat`, 'right');
    scrollToBottom();
  });

  socket.on('receive', (data) => {
    append(`${data.name}: ${data.message}`, 'left');
    scrollToBottom();
  });

  socket.on('left',name=>{
    append(`${name} left the chat`,'right');
    scrollToBottom();
  })
  function scrollToBottom() {
    messageContainer.scrollTop = messageContainer.scrollHeight
}

});
