const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');

const eventSource = new EventSource('/sse');

eventSource.onmessage = function(event) {
  messages.innerHTML += `<p>${event.data}</p>`;
};

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  fetch(`/chat?message=${encodeURIComponent(text)}`);
  input.value = '';
});