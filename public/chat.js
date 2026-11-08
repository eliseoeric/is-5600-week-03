const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const events = new EventSource('/sse');

events.onmessage = (event) => {
  const paragraph = document.createElement('p');
  paragraph.textContent = JSON.parse(event.data);
  messages.appendChild(paragraph);
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const message = input.value.trim();
  if (!message) return;

  try {
    const response = await fetch(`/chat?message=${encodeURIComponent(message)}`);
    if (!response.ok) throw new Error('Message could not be sent.');
    input.value = '';
  } catch (error) {
    console.error(error);
    alert('Message could not be sent. Please try again.');
  }
});