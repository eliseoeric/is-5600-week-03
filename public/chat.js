const eventSource = new EventSource("/sse");

eventSource.onmessage = (event) => {
  const messageElement = document.createElement("p");
  messageElement.textContent = event.data;
  document.getElementById("messages").appendChild(messageElement);
};

document.getElementById("form").addEventListener("submit", (event) => {
  event.preventDefault();
  
  const message = document.getElementById("input").value;
  if (message.trim()) {
    fetch(`/chat?message=${encodeURIComponent(message)}`);
    document.getElementById("input").value = "";
  }
});
