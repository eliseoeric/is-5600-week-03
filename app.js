const http = require('http');
const url = require('url');

const path = require('path');

const express = require('express');
const port = process.env.PORT || 3000;
const app = express();

app.use(express.static(__dirname + '/public'));

//app.get('/', respondText);
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/chat', respondChat);
app.get('/', chatApp);

const EventEmitter = require('events');

const chatEmitter = new EventEmitter();


function respondChat (req, res) {
    const { message } = req.query;

    chatEmitter.emit('message', message);
    res.end();
  }

app.listen(port, () => {
  console.log(`Listening on port ${port}`); 
});



function respondChat (req, res) {
  const { message } = req.query;

  chatEmitter.emit('message', message);
  res.end();
}

//const port = process.env.PORT || 3000;

const server = http.createServer(function(request,response){
   // response.setHeader('Content-Type','application/json');
   // response.end(JSON.stringify({text:'hi',number:[1,2,3]}));

   const parsedUrl = url.parse(request.url,true);
   const pathname = parsedUrl.pathname;

   console.log("url",pathname);
   if(pathname === '/') return respondText(request,response);
   if(pathname === '/json') return respondJson(request,response);
   if (pathname.match(/^\/echo/)) return respondEcho(request, response);

   respondNotFound404(request,response);
});


function respondText(req,res)
{
    res.setHeader('Content-type','text/plan');
    res.end('hi');
}


function respondJson(req,res)
{
    res.json({
        text:'history',
        number:[1,2,3],
    });
}

function respondNotFound404(req,res)
{
    res.writeHead(404,{'Content-Type':"text/plain"});
    res.end('404 :Request Not Found');
}


function respondEcho(req,res){

    const{input = ''} = res.query;

     res.json({   
        normal:input,
        shouty:input.toUpperCase(),
        charCount : input.length,
        backwards: input.split('').reverse().join(),

    });

}


function chatApp(req, res) {
  res.sendFile(path.join(__dirname, '/chat.html'));
}


app.get('/sse', respondSSE);

function respondSSE (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
  });

  const onMessage = message => res.write(`data: ${message}\n\n`); // use res.write to keep the connection open, so the client is listening for new messages
  chatEmitter.on('message', onMessage);

  res.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
}