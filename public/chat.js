// public/chat.js

// Select DOM elements
const messagesEl = document.getElementById('messages');
const formEl = document.getElementById('form');
const inputEl = document.getElementById('input');

// Listen for server-sent events
const eventSource = new EventSource('/sse');

eventSource.onmessage = function(event) {
  const msg = document.createElement('p');
  msg.textContent = event.data;
  messagesEl.appendChild(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight; // auto scroll to latest
};

// Handle sending messages
formEl.addEventListener('submit', function(event) {
  event.preventDefault();

  const message = inputEl.value.trim();
  if (message === '') return;

  // Send message to server via GET query parameter
  fetch(`/chat?message=${encodeURIComponent(message)}`)
    .catch(err => console.error('Error sending message:', err));

  inputEl.value = '';
});
