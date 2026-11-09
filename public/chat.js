const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');
const stream = new EventSource('/sse');

stream.onmessage = (event) => {
  const paragraph = document.createElement('p');
  paragraph.textContent = event.data;
  messages.appendChild(paragraph);
};

const status = document.createElement('p');
status.setAttribute('role', 'status');
form.after(status);

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const message = input.value;
  if (!message.trim()) {
    status.textContent = 'Enter a message.';
    return;
  }

  status.textContent = '';
  const query = new URLSearchParams({ message });

  try {
    const response = await fetch(`/chat?${query}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Chat request failed.');
    if (input.value === message) input.value = '';
  } catch {
    status.textContent = 'Could not send your message. Please try again.';
  }
});
