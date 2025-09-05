// public/chat.js

// Listen for messages
new EventSource("/sse").onmessage = e => {
  window.messages.innerHTML += `<p>${e.data}</p>`;
};

// Send a chat message
window.form.addEventListener('submit', e => {
  e.preventDefault();
  fetch(`/chat?message=${window.input.value}`);
  window.input.value = '';
});
