// public/chat.js
new window.EventSource("/sse").onmessage = function(event) {
    window.messages.innerHTML += `<div>${event.data}</div>`;
};

window.form.addEventListener('submit', function(event) {
    event.preventDefault();
    window.fetch(`/chat?message=${window.input.value}`);
    window.input.value = '';
});