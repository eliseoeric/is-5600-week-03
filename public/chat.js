// SSE client (as per lab instructions)
const eventSource = new EventSource('/sse');
eventSource.onmessage = (event) => {
  window.messages.innerHTML += `<p>${event.data}</p>`;
};

// Send messages via fetch
window.form.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = window.input.value;
  fetch(`/chat?message=${encodeURIComponent(message)}`);
  window.input.value = '';
});