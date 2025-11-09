const messagesEl = document.getElementById('messages');
const formEl = document.getElementById('form');
const inputEl = document.getElementById('input');

new EventSource('/sse').onmessage = (event) => {
  messagesEl.innerHTML += `<p>${event.data}</p>`;
  messagesEl.scrollTop = messagesEl.scrollHeight;
};

formEl.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = inputEl.value.trim();
  if (!msg) return;
  fetch(`/chat?message=${encodeURIComponent(msg)}`);
  inputEl.value = '';
});
