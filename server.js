var bodyParser = require('body-parser');
var express = require('express');

var server = express();
server.set('port', (process.env.PORT || 5000));
server.disable('x-powered-by');
server.engine('.html', require('ejs').renderFile);
server.use('/mwrta', bodyParser.json({type: '*/*'}), require("./mwrta"));
server.get('/', function(req, res) {
  res.render("index.html");
});
server.get('/index.html', function(req, res) {
  res.render("index.html");
});

server.listen(server.get('port'), function() {
  console.log('mwrta-map is running on port', server.get('port'));
});
