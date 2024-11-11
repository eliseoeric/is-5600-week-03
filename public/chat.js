new window.EventSource("/sse").onmessage = function(event) {
    const p = document.createElement('p');
    p.textContent = event.data;
    window.messages.appendChild(p);
};

window.form.addEventListener('submit', function(event) {
    event.preventDefault();

    window.fetch(`/chat?message=${encodeURIComponent(window.input.value)}`);
    window.input.value = '';
});
