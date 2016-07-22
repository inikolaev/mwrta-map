var bodyParser = require('body-parser');
var express = require('express');

var server = express();
server.set('port', (process.env.PORT || 5000));
server.disable('x-powered-by');
server.use('/mwrta', bodyParser.json({type: '*/*'}), require("./mwrta"));

server.listen(server.get('port'));
