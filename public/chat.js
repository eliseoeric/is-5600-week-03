// Set up Server-Sent Events listener
new window.EventSource('/sse').onmessage = function(event) {
    window.messages.innerHTML += `<p>${event.data}</p>`; // Fix innerHtml to innerHTML and use backticks for template literals
};

window.form.addEventListener('submit', function(event) {
    event.preventDefault();

    window.fetch(`/chat?message=${window.input.value}`);
    window.input.value = ''; // Fix typo with commas
});