const messagesDiv = document.getElementById("messages");
const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");

// Send a chat message
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = input.value;
  if (message.trim() === "") return;

  fetch(`/chat?message=${encodeURIComponent(message)}`);
  input.value = "";
});

// Receive messages using SSE
const evtSource = new EventSource("/sse");
evtSource.onmessage = function (event) {
  const newMsg = document.createElement("div");
  newMsg.textContent = event.data;
  messagesDiv.appendChild(newMsg);
};
