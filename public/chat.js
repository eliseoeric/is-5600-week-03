"use strict";

const messages = document.querySelector("#messages");
const form = document.querySelector("#form");
const input = document.querySelector("#input");
const messageStream = new window.EventSource("/sse");

messageStream.onmessage = (event) => {
  const paragraph = document.createElement("p");
  // Display messages as text so HTML in a message cannot execute.
  paragraph.textContent = event.data;
  messages.append(paragraph);
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = input.value;
  if (!message.trim() || input.disabled) return;

  input.disabled = true;
  try {
    // Encoding preserves spaces, ampersands, hashes, and other special symbols.
    const response = await window.fetch(`/chat?message=${encodeURIComponent(message)}`);
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    input.value = "";
  } catch (error) {
    const paragraph = document.createElement("p");
    paragraph.textContent = `Message not sent. Please try again. ${error.message}`;
    messages.append(paragraph);
  } finally {
    input.disabled = false;
    input.focus();
  }
});
