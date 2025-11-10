const messagesDiv = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');

// Listen for messages from server via SSE
const eventSource = new EventSource('/sse');

eventSource.onmessage = function(event) {
  messagesDiv.innerHTML += `<p>${event.data}</p>`;
};

// Send messages to server
form.addEventListener('submit', function(event) {
  event.preventDefault();
  const message = input.value.trim();
  if (message) {
    fetch(`/chat?message=${encodeURIComponent(message)}`);
    input.value = '';
  }
});
