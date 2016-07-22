var bodyParser = require('body-parser');
var express = require('express');

var port = process.env.PORT || 8080;

var server = express();
server.disable('x-powered-by');
server.use('/mwrta', bodyParser.json({type: '*/*'}), require("./mwrta"));

server.listen(port);
