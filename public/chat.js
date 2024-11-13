
const messagesDiv = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');


const eventSource = new EventSource('/sse');
eventSource.onmessage = function(event) {
  const newMessage = document.createElement('p');
  newMessage.textContent = event.data;
  messagesDiv.appendChild(newMessage);
};


form.addEventListener('submit', function(event) {
  event.preventDefault();
  fetch(`/chat?message=${encodeURIComponent(input.value)}`);
  input.value = '';
});
