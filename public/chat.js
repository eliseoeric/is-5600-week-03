const eventSource = new EventSource('/sse');

eventSource.onmessage = (event) => {
  const messageElement = document.createElement('p');
  messageElement.textContent = event.data;
  window.messages.appendChild(messageElement);
};

window.form.addEventListener('submit', (event) => {
  event.preventDefault();

  const message = window.input.value.trim();
  if (message) {
    fetch(`/chat?message=${encodeURIComponent(message)}`);
    window.input.value = '';
  }
});
