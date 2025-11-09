
const eventStream = new EventSource("/stream");

eventStream.onmessage = (e) => {
  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML += `<p>${e.data}</p>`;
  chatBox.scrollTop = chatBox.scrollHeight; // auto-scroll to newest message
};


const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = chatInput.value.trim();

  if (message) {
    fetch(`/chat?message=${encodeURIComponent(message)}`);
    chatInput.value = "";
  }
});
