// Connect to the Server-Sent Events endpoint
const eventSource = new window.EventSource("/sse");

eventSource.onmessage = function(event) {
  const messagesDiv = document.getElementById('messages');
  messagesDiv.innerHTML += `<p>${event.data}</p>`;
};

// Handle form submission
const form = document.getElementById('form');
const input = document.getElementById('input');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  // Send the message to the server via a query parameter
  window.fetch(`/chat?message=${encodeURIComponent(input.value)}`);
  input.value = '';
});