new window.EventSource("/sse").onmessage = function(event) {
  document.getElementById('messages').innerHTML += `<p>${event.data}</p>`;
};

document.getElementById('form').addEventListener('submit', function(event) {
  event.preventDefault();
  const input = document.getElementById('input');
  fetch(`/chat?message=${input.value}`);
  input.value = '';
});
