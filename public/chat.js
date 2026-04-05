const form = document.getElementById('form');
const input = document.getElementById('input');
const messageList = document.getElementById('messageList');

// Fetch messages
async function fetchMessages() {
  const res = await fetch('/api/messages');
  const data = await res.json();

  messageList.innerHTML = '';

  data.forEach(msg => {
    const li = document.createElement('li');
    li.textContent = msg;
    messageList.appendChild(li);
  });
}

// Send message
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (input.value.trim() === '') return;

  await fetch('/api/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: input.value })
  });

  input.value = '';
  fetchMessages();
});

// Auto refresh messages
setInterval(fetchMessages, 1000);

// Initial load
fetchMessages();