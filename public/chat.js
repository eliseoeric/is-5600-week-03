new window.EventSource("/sse").onmessage = function(event) {
  const msgBox = document.getElementById("messages");
  msgBox.innerHTML += `<p>${event.data}</p>`;
};

const form = document.getElementById("form");
const input = document.getElementById("input");

form.addEventListener("submit", function(event) {
  event.preventDefault();
  const msg = encodeURIComponent(input.value);
  if (!msg) return;
  fetch(`/chat?message=${msg}`);
  input.value = "";
});
