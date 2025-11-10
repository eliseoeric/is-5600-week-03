# Lab 03 – Node API

This lab demonstrates three simple Node.js projects that use both the native **HTTP** module and the **Express.js** framework.

---

## 📁 Files

| File | Description |
|------|--------------|
| `index.js` | Basic Node HTTP server returning JSON responses. |
| `express-server.js` | Express API with routes and JSON output. |
| `chat-app.js` | Simple chat API that saves messages to `data/messages.json`. |
| `data/messages.json` | Stores chat data locally. |

---

## ⚙️ Setup

```bash
npm install
▶️ Run Commands
Run HTTP server
bash
Copy code
npm run http
Open: http://localhost:3000

Endpoints:

GET /

GET /api/health

GET /api/echo?name=Divya

Run Express server
bash
Copy code
npm run express
Open: http://localhost:3000

Endpoints:

GET /

GET /api/health

GET /api/echo

POST /api/echo

Run Chat API
bash
Copy code
npm run chat
Open: http://localhost:3000

Endpoints:

GET /api/messages → list messages

POST /api/messages → add a message
Example body:

json
Copy code
{ "user": "Divya", "text": "Hello from Lab 03!" }
🧠 Notes
Default port: 3000

No database or authentication used.

This project focuses on Node fundamentals, Express routing, and file-based I/O.
