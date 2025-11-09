// public/chat.js
// Append SSE messages to `#messages`, post messages from the form

// create an EventSource listening to /sse
new window.EventSource("/sse").onmessage = function(event) {
  // ensure an element with id "messages" exists in chat.html
  window.messages.innerHTML += `<p>${event.data}</p>`;
};

window.form.addEventListener('submit', function(event) {
  event.preventDefault();

  const msg = window.input.value;
  if (!msg) return;

  // send message to server (GET query param)
  window.fetch(`/chat?message=${encodeURIComponent(msg)}`);
  window.input.value = '';
});
