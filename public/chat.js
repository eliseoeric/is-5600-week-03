
const eventSource = new EventSource('/sse');


eventSource.onmessage = (event) => {
  const messagesDiv = document.getElementById('messages');
  const messageEl = document.createElement('p');
  messageEl.textContent = event.data;
  messagesDiv.appendChild(messageEl);

 
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
};


const form = document.getElementById('form');
const input = document.getElementById('input');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const message = input.value.trim();
  if (!message) return; 

  
  fetch(`/chat?message=${encodeURIComponent(message)}`);

  
  input.value = '';
});
