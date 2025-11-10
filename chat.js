(() => {
  const $messages = document.getElementById('messages');
  const $form = document.getElementById('form');
  const $input = document.getElementById('input');

  const appendLine = (text) => {
    const p = document.createElement('p');
    p.textContent = text;
    $messages.appendChild(p);
  };

  const stream = new EventSource('/sse');
  stream.onmessage = (evt) => {
    appendLine(evt.data);
  };

  $form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = ($input.value || '').trim();
    if (!text) return;
    const q = encodeURIComponent(text);
    fetch(`/chat?message=${q}`).catch(() => {
      appendLine('[error] failed to send');
    });
    $input.value = '';
    $input.focus();
  });
})();
