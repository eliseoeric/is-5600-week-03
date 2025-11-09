const messagesDiv = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');

new EventSource('/sse').onmessage = function(event) {
  messagesDiv.innerHTML += `<p>${event.data}</p>`;
};

form.addEventListener('submit', function(e) {
  e.preventDefault();
  fetch(`/chat?message=${encodeURIComponent(input.value)}`);
  input.value = '';
});
