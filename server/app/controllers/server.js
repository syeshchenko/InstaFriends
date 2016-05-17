var https = require('https');
var http  = require('http');
var fs    = require('fs');

var options = null;
var port = null;

function setup() {
  var key = null;
  var cert = null;

  // load ssl keys
  try {
    key = fs.readFileSync('./ssl/server.key');
  } catch(ex) {}

  try {
    cert = fs.readFileSync('./ssl/server.crt');
  } catch(ex) {}

  if (key && cert) {
     options = {
      key: key,
      cert: cert
    };
  }
  
  // determine port
  port = process.env.PORT || 5000;
}

function start(app) {
  if (options) {
    return https.createServer(options, app);
  } else {
    return http.createServer(app);
  }
}

function create(app) {
  setup();

  start(app).listen(port, function() {
    var address = "http://localhost";
    if (options) {
       address = "https://localhost";
    }
    console.log('InstaFriends is running at ' + address + ':' + port);
  });

}

exports.create = create;
