// EventSource to listen for messages from the server
new window.EventSource("/sse").onmessage = function(event) {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML += `<p>${event.data}</p>`;
  };
  
  // Form submission to send a new message to the server
  const form = document.getElementById('form');
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent page reload on submit
  
    const input = document.getElementById('input');
    const message = input.value;
  
    if (message.trim()) {
      // Send message as a query parameter
      fetch(`/chat?message=${encodeURIComponent(message)}`);
      input.value = ''; // Clear the input field
    }
  });
  