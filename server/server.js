var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var mongoose   = require('mongoose');
var passport   = require('passport');
var session    = require('express-session');
var flash      = require('connect-flash');

var config = require('./config');
var route  = require('./routes');

var apiRoutes = express.Router();
require('./app/config/passport')(passport); // pass passport for configuration

// set up app port
var port = process.env.PORT || 5000;

// connect to db
mongoose.connect(config.dbConnection);

// setup bodyParser middleware so we can get variables passed with request
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// set up logs output to console
app.use(morgan('dev'));

// required for passport
app.use(session({ secret: config.secret })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// serve static files
app.use(express.static("../client/"));
// TODO: Investigate if we need to explicitly specify index.html or if it's served automatically
// app.get('/', function(req, res) {
//   res.render('index.html');
// });

// set up routes
route.setup(apiRoutes, app, passport);
app.use('/api', apiRoutes);

app.listen(port);

console.log('magic happens at http://localhost:' + port);

exports.app = app;
