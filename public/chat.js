const messageList = document.getElementById('messages');
const form = document.getElementById('chat-form');
const userInput = document.getElementById('user');
const textInput = document.getElementById('text');

async function loadMessages() {
  const res = await fetch('/messages');
  const data = await res.json();
  messageList.innerHTML = data.map(m => `<li><b>${m.user}</b>: ${m.text}</li>`).join('');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const user = userInput.value.trim();
  const text = textInput.value.trim();
  if (!user || !text) return;

  await fetch('/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, text })
  });

  textInput.value = '';
  await loadMessages();
});

loadMessages();
