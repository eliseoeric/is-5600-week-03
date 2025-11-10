// public/chat.js

// Listen for server-sent events
new EventSource('/sse').onmessage = function(event) {
  document.getElementById('messages').innerHTML += `<p>${event.data}</p>`;
};

// Send message on form submit
document.getElementById('form').addEventListener('submit', function(event) {
  event.preventDefault();
  const input = document.getElementById('input');
  if (input.value.trim() === '') return;
  fetch(`/chat?message=${encodeURIComponent(input.value)}`);
  input.value = '';
});