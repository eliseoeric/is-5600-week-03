// public/chat.js
// SSE chat client for /sse and /chat

document.addEventListener('DOMContentLoaded', () => {
  const messagesEl = document.getElementById('messages');
  const formEl = document.getElementById('form');
  const inputEl = document.getElementById('input');

  if (!messagesEl || !formEl || !inputEl) return;

  const es = new window.EventSource('/sse');
  es.onmessage = (event) => {
    const p = document.createElement('p');
    p.textContent = event.data;
    messagesEl.appendChild(p);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  };

  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = inputEl.value.trim();
    if (!msg) return;
    await window.fetch(`/chat?message=${encodeURIComponent(msg)}`);
    inputEl.value = '';
    inputEl.focus();
  });
});
