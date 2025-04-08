// Listen for messages from the server using Server-Sent Events (SSE)
new window.EventSource("/sse").onmessage = function(event) {
    // Append the new message to the messages div
    window.messages.innerHTML += `<p>${event.data}</p>`;
  };
  
  // Send a new message to the server when the form is submitted
  window.form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from reloading the page
  
    // Use fetch to send the message to the /chat endpoint
    window.fetch(`/chat?message=${window.input.value}`);
    
    // Clear the input field after sending the message
    window.input.value = '';
  });
  