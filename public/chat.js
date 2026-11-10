
const messages = document.querySelector('#messages');
const form = document.querySelector('#form');
const input = document.querySelector('#input');

// Listen for messages from the server
const eventSource = new EventSource('/sse');

eventSource.onmessage = function(event) {
    const paragraph = document.createElement('p');
    paragraph.textContent = JSON.parse(event.data);
    messages.appendChild(paragraph);
};

// Send a message to the server
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const message = input.value.trim();

    if (message === '') {
        return;
    }

    fetch(`/chat?message=${encodeURIComponent(message)}`);

    input.value = '';
});
