var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var passport   = require('passport');
var session    = require('express-session');
var flash      = require('connect-flash');

var config             = require('./config');
var router              = require('./routes');
var passportController = require('./app/controllers/passport');
var serverConroller    = require('./app/controllers/server');

// pass passport for configuration
passportController.initialize(passport);

var apiRoutes = express.Router();

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

// set up routes
router.setup(apiRoutes, app, passport);
app.use('/api', apiRoutes);

// start http/https server
serverConroller.create(app);

exports.app = app;
