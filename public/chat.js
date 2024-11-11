new window.EventSource("/sse").onmessage = (event) => {
    window.messages.innerHTML += `<p>${event.data}</p>`;
  };
  
  window.form.addEventListener('submit', (event) => {
    event.preventDefault();
    window.fetch(`/chat?message=${window.input.value}`);
    window.input.value = '';
  });
  