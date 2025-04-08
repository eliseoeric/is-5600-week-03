new window.EventSource("/sse").onmessage = function(event) {
    window.messages.innerHTML += `<p>${event.data}</p>`;
  };

  window.form.addEventListener('submit', function(event) {
    event.preventDefault();

    window.fetch(`/chat?message=${window.input.value}`);
    window.input.value = '';
})

app.get('/chat', respondChat);

function respondChat (req, res) {
  const { message } = req.query;

  chatEmitter.emit('message', message);
  res.end();
}