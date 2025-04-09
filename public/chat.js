window.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const messages = document.getElementById('messages');
  
    // Connect to SSE stream
    const eventSource = new EventSource('/sse');
  
    eventSource.onmessage = (event) => {
      const msg = document.createElement('p');
      msg.textContent = event.data;
      messages.appendChild(msg);
    };
  
    // Submit form to send message
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const text = input.value.trim();
      if (text) {
        fetch(`/chat?message=${encodeURIComponent(text)}`);
        input.value = '';
      }
    });
  });