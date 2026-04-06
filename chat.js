public/chat.js
// Listen for messages
new EventSource('/sse').onmessage = function (event) {
  window.messages.innerHTML += `<p>${event.data}</p>`;
};

// Send message
window.form.addEventListener('submit', function (event) {
  event.preventDefault();

  fetch(`/chat?message=${window.input.value}`);

  window.input.value = '';
});