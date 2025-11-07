// Listen for server-sent messages
new window.EventSource("/sse").onmessage = function(event) {
  window.messages.innerHTML += `<p>${event.data}</p>`;
  window.messages.scrollTop = window.messages.scrollHeight; // Auto-scroll
};

// Handle form submission
window.form.addEventListener('submit', function(event) {
  event.preventDefault();
  if (window.input.value.trim() !== '') {
    window.fetch(`/chat?message=${encodeURIComponent(window.input.value)}`);
    window.input.value = '';
  }
});
