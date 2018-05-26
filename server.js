var StaticServer = require('static-server');

var server = new StaticServer({
  rootPath: './app/',
  port: 3000
});

server.start(function() {
  console.log('Server started on port ' + server.port);
});
