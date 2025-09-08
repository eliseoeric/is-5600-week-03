new window.EventSource('/sse').onmessage = function (event) {
  const p = document.createElement('p');
  p.textContent = event.data;
  window.messages.appendChild(p);
  window.messages.scrollTop = window.messages.scrollHeight;
};

window.form.addEventListener('submit', function (event) {
  event.preventDefault();
  const text = window.input.value.trim();
  if (!text) return;
  window.fetch(`/chat?message=${encodeURIComponent(text)}`);
  window.input.value = '';
});
