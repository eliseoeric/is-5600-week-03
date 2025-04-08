const eventSource = new EventSource('/sse');

eventSource.onmessage = (event) => {
  const messages = document.getElementById('messages');
  messages.innerHTML += `<p>${event.data}</p>`;
};

const form = document.getElementById('form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.getElementById('input');
  fetch(`/chat?message=${encodeURIComponent(input.value)}`);
  input.value = '';
});
