
new window.EventSource("/sse").onmessage = function(event) {
  const paragraph = document.createElement('p');
  paragraph.textContent = event.data;
  window.messages.appendChild(paragraph);
};

window.form.addEventListener('submit', function(event) {
  event.preventDefault();

  window.fetch(`/chat?message=${encodeURIComponent(window.input.value)}`);
  window.input.value = '';
});
