const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');
const events = new window.EventSource('/sse');

events.onmessage = event => {
  const message = document.createElement('p');
  message.textContent = event.data;
  messages.appendChild(message);
};

form.addEventListener('submit', async event => {
  event.preventDefault();

  const message = input.value.trim();

  if (message === '') {
    return;
  }

  try {
    const response = await window.fetch(`/chat?message=${encodeURIComponent(message)}`);

    if (!response.ok) {
      throw new Error(`Sending message failed (${response.status})`);
    }

    input.value = '';
  } catch (error) {
    console.error(error);
  }
});