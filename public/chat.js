// public/chat.js

// Initialize EventSource to listen for server-sent events
const eventSource = new EventSource("/sse");

// Listen for incoming messages and append them to the messages div
eventSource.onmessage = function(event) {
  const messagesDiv = document.getElementById('messages');
  messagesDiv.innerHTML += `<p>${event.data}</p>`;
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll to the bottom
};

// Handle form submission to send messages
const form = document.getElementById('form');
const input = document.getElementById('input');

form.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting the traditional way

  const message = input.value.trim();
  if (message) {
    // Send the message to the server via the /chat endpoint
    fetch(`/chat?message=${encodeURIComponent(message)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });

    input.value = ''; // Clear the input field
  }
});
