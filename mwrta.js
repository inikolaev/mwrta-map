var http = require('http');
var express = require("express");
var router = express.Router();

if (!Array.add) {
  Array.add = function(c, e) {
    c.push(e);
  };
}

router.use(function(req, res, next) {
  try {
      var options = {
        host: 'vc.mwrta.com',
        path: '/api/FR/0'
      }
      var request = http.request(options, function (response) {
        var data = '';
        response.on('data', function (chunk) {
          data += chunk;
        });
        response.on('end', function () {
          res.set({"Access-Control-Allow-Origin" : "*"});
          res.send(data);
        });
      });
      request.on('error', function (e) {
        console.log(e.message);
      });
      request.end();
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;
