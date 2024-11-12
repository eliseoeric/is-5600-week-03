// Listen for server-sent events from /sse
new window.EventSource("/sse").onmessage = function(event) {
    window.messages.innerHTML += `<p>${event.data}</p>`;
  };
  
  // Send chat message to server when the form is submitted
  window.form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    window.fetch(`/chat?message=${window.input.value}`);
    window.input.value = ''; // Clear input after sending
  });
  