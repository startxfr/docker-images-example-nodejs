// Load the http module to create an http server.
var http = require('http');
var server = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Hello World, i'm an example\n");
});
server.listen(8080);
console.log("Example server is running");