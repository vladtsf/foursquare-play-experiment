
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();
var port;
// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  port = 3000;
});

app.configure('production', function(){
  app.use(express.errorHandler());
  port = 80;
});

// Routes

app.get('/', routes.index);
app.get('/city/', routes.decode);
app.get(/\/city\/([\d.\-]+)\,([\d.\-]+)\/?(\d*)\/?/, routes.city);

app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
