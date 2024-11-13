// chat.js
const messagesDiv = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');

// Listen for messages from the server
const eventSource = new EventSource('/sse');
eventSource.onmessage = function(event) {
  const newMessage = document.createElement('p');
  newMessage.textContent = event.data;
  messagesDiv.appendChild(newMessage);
};

// Send message to the server
form.addEventListener('submit', function(event) {
  event.preventDefault();
  fetch(`/chat?message=${encodeURIComponent(input.value)}`);
  input.value = '';
});
