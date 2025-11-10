const messageStream = new EventSource('/sse');
const messagesBox = document.getElementById('messages');
const chatForm = document.getElementById('form');
const chatInput = document.getElementById('input');

messageStream.onmessage = event => {
  const newMessage = document.createElement('p');
  newMessage.textContent = event.data;
  messagesBox.appendChild(newMessage);
};

chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;

  fetch(`/chat?message=${encodeURIComponent(message)}`);
  chatInput.value = '';
});
