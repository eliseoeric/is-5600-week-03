// when server sends messages, display them:
new window.EventSource("/sse").onmessage = function(event) {
  window.messages.innerHTML += `<p>${event.data}</p>`;
};

// when user submits message, send it to server
window.form.addEventListener("submit", function(event) {
  event.preventDefault();
  window.fetch(`/chat?message=${encodeURIComponent(window.input.value)}`);
  window.input.value = "";
});
