// public/chat.js

// Create a new EventSource to listen for server-sent events
new window.EventSource("/sse").onmessage = function(event) {
  window.messages.innerHTML += `<p>${event.data}</p>`;
};

// Handle form submission to send messages
window.form.addEventListener('submit', function(event) {
  event.preventDefault();

  window.fetch(`/chat?message=${window.input.value}`);
  window.input.value = '';
});