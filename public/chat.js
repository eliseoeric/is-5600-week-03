// Connect to the Server-Sent Events stream
new window.EventSource("/sse").onmessage = function(event) {
  window.messages.innerHTML += `<p>${event.data}</p>`;
};

// Handle form submission to send messages
window.form.addEventListener('submit', function(event) {
  event.preventDefault();

  const message = window.input.value;
  if (message) {
    window.fetch(`/chat?message=${encodeURIComponent(message)}`);
    window.input.value = '';
  }
});