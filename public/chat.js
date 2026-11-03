const messages = document.getElementById("messages");
const form = document.getElementById("form");
const input = document.getElementById("input");

const events = new EventSource("/sse");

events.onmessage = function (event) {
  const paragraph = document.createElement("p");
  paragraph.textContent = event.data;
  messages.appendChild(paragraph);
};

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const message = input.value;
  if (!message.trim()) return;

  try {
    const response = await fetch(
      `/chat?message=${encodeURIComponent(message)}`
    );

    if (!response.ok) {
      throw new Error("Message could not be sent");
    }

    input.value = "";
    input.focus();
  } catch (error) {
    alert(error.message);
  }
}); 