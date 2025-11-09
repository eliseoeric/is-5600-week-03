// public/chat.js
// Hook up DOM elements on load
window.addEventListener('DOMContentLoaded', () => {
  const source = new EventSource('/sse');

  source.onmessage = function(event) {
    const messages = document.getElementById('messages');
    const p = document.createElement('p');
    p.textContent = event.data;
    messages.appendChild(p);
    // scroll to bottom
    window.scrollTo(0, document.body.scrollHeight);
  };

  const form = document.getElementById('form');
  const input = document.getElementById('input');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const msg = input.value.trim();
    if (!msg) return;
    // Send message via GET query param
    fetch(`/chat?message=${encodeURIComponent(msg)}`);
    input.value = '';
  });
});
