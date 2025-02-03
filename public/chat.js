new window.EventSource("/sse").onmessage = function (event) {
    window.messages.innerHTML += `<p>${event.data}</p>`;
  };
  
  // Handle the form submission to send a chat message
  window.form.addEventListener("submit", function (event) {
    event.preventDefault();
    // Send the message to the server via the /chat endpoint
    window.fetch(`/chat?message=${window.input.value}`);
    // Clear the input field after sending the message
    window.input.value = "";
  });