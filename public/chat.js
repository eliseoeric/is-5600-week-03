// Get elements from HTML
const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');

// Listen for server-sent events (SSE)
const eventSource = new EventSource('/sse');

eventSource.onmessage = function(event) {
  const messageElement = document.createElement('p');
  messageElement.textContent = event.data;
  messages.appendChild(messageElement);
};

// Send message to server
form.addEventListener('submit', function(event) {
  event.preventDefault();

  const message = input.value.trim();

  if (message !== '') {
    fetch(`/chat?message=${encodeURIComponent(message)}`);
    input.value = '';
  }
});