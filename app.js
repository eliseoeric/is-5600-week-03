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
// register the endpoint with the app (make sure to remove the old binding to the `/` route)
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

/*server.listen(port, function() {
    console.log(`Server is listening on port ${port}`);
    
  });*/
/**
 * Responds with plain text
 * 
 * @param{http.IncomingMessage} req
 * @param(http.serverResponse) res
 * 
 */
function respondText(req,res)
{
    res.setHeader('Content-type','text/plan');
    res.end('hi');
}

/**
 * Responds with JSON
 * 
 * @param{http.IncomingMessage} req
 * @param{http.serverResponse} res
 */
function respondJson(req,res)
{
    //res.setHeader('Content-type','application/Json');
    //res.end(JSON.stringify({'text':'hi','number':[1,2,3]}));
    res.json({
        text:'history',
        number:[1,2,3],
    });
}
/**
 * Respond with 404 page not found
 * 
 * @param{http.IncomgingMessage} req
 * @param{http.serverResponse} res
 * 
 */

function respondNotFound404(req,res)
{
    res.writeHead(404,{'Content-Type':"text/plain"});
    res.end('404 :Request Not Found');
}
/**
 * Respond with input string in various formats
 * 
 * @param {http.IncomingMessage} req
 * @param {http.serverResponse}  res
 * 
 * 
 */

function respondEcho(req,res){

   // const urlObj = new URL(req.url,'http://${req.headers.host}');
   // const input = urlObj.searchParams.get('input') || '';


    const{input = ''} = res.query;

    //res.setHeader('Content-Type','application/json');
   // res.end(JSON.stringify({
     res.json({   normal:input,
        shouty:input.toUpperCase(),
        charCount : input.length,
        backwards: input.split('').reverse().join(),

    });

}
/**
* Serves up the chat.html file
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function chatApp(req, res) {
  res.sendFile(path.join(__dirname, '/chat.html'));
}




/**
 * This endpoint will respond to the client with a stream of server sent events
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
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