new window.EventSource('/sse').onmessage = function (event) {
  window.messages.innerHTML += `<p>${event.data}</p>`;
};

window.form.addEventListener('submit', function (event) {
  event.preventDefault();

  if (!window.input.value.trim()) return;

  window.fetch(`/chat?message=${encodeURIComponent(window.input.value)}`);
  window.input.value = '';
});