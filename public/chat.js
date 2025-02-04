// Set up Server-Sent Events listener
new window.EventSource('/sse').onmessage = function(event) {
    window.messages.innerHTML += `<p>${event.data}</p>`; // Fix innerHtml to innerHTML and use backticks for template literals
};

// Set up form submission
window.form.addEventListener('submit', function(event) {
    event.preventDefault();

    // Correct template literal and fix typo
    window.fetch(`/chat?message=${window.input.value}`);
    window.input.value = ''; // Fix typo with commas
});