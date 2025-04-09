new window.EventSource("/sse").onmessage = function(event) {
    window.messages.innerHTML += `<p>${event.data}</p>`;
  };
  
  window.form.addEventListener("submit", function(event) {
    event.preventDefault();
    fetch(`/chat?message=${window.input.value}`);
    window.input.value = "";
  });
  