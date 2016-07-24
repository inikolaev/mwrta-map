var http = require('http');
var express = require("express");
var router = express.Router();
var moment = require('moment-timezone');

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
          res.set({"Access-Control-Allow-Origin" : "*", "Content-type" : "application/json; charset=utf-8"});
          json = JSON.parse(data);

          for (var i = 0; i < json.length; i++) {
              var time = json[i].DateTime;
              var timestamp = new Date(moment.tz(time, "America/New_York").format()).getTime();
              json[i].DateTimestamp = timestamp;
          }

          res.send(JSON.stringify(json));
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
