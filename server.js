var bodyParser = require('body-parser');
var express = require('express');

function ensureSecure(req, res, next) {
  if (req.secure) {
    return next();
  }

  res.redirect('https://' + req.hostname + req.url);
};

var server = express();
server.set('port', (process.env.PORT || 5000));
server.disable('x-powered-by');
server.engine('.html', require('ejs').renderFile);
//server.all('*', ensureSecure);
server.use('/mwrta', bodyParser.json({type: '*/*'}), require("./mwrta"));
server.use('/', express.static('.'))

server.listen(server.get('port'), function() {
  console.log('mwrta-map is running on port', server.get('port'));
});
