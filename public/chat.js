
// Stream messages from the server
new window.EventSource('/sse').onmessage = function (event) {
  const p = document.createElement('p');
  p.textContent = event.data;
  document.getElementById('messages').appendChild(p);
};

// Send messages to the server
document.getElementById('form').addEventListener('submit', function (e) {
  e.preventDefault();
  const input = document.getElementById('input');
  const text = input.value.trim();
  if (text) {
    fetch(`/chat?message=${encodeURIComponent(text)}`);
  }
  input.value = '';
  input.focus();
});
