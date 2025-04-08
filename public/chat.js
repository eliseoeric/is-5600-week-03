new window.EventSource("/sse").onmessage = function (event) {
    const msgContainer = document.getElementById("messages");
    msgContainer.innerHTML += `<p>${event.data}</p>`;
  };
  
  const form = document.getElementById("form");
  const input = document.getElementById("input");
  
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    fetch(`/chat?message=${encodeURIComponent(input.value)}`);
    input.value = "";
  });
  