// Listen for server-sent events (SSE) and append new messages to the chat window
new window.EventSource("/sse").onmessage = function (event) {
    // Whenever a new message is received from the server, append it to the chat window
    window.messages.innerHTML += `<p>${event.data}</p>`;
};

// Handle the form submission to send a chat message
window.form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior (page reload)
    
    // Send the message to the server via the /chat endpoint by including the message as a query parameter
    window.fetch(`/chat?message=${window.input.value}`);
    
    // Clear the input field after sending the message so the user can type a new message
    window.input.value = "";
});
