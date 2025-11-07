// public/chat.js
const messages = document.getElementById("messages");
const form = document.getElementById("form");
const input = document.getElementById("input");

// Listen for server-sent events
new EventSource("/sse").onmessage = function(event) {
  messages.innerHTML += `<p>${event.data}</p>`;
};

// Send messages on form submit
form.addEventListener("submit", function(event) {
  event.preventDefault();

  const msg = encodeURIComponent(input.value);
  if (!msg) return;

  fetch(`/chat?message=${msg}`);
  input.value = "";
});
