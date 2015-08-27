var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
// var multer = require('multer');	// file upload helper
var flash = require('connect-flash');
var mongo = require('mongodb');
// var mongoose = require('mongoose');
// var db = mongoose.connection;
var port = 3000;

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
console.log('Express initialized!');

// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
console.log('Jade initilaized!');

// uncomment after placing favicon in /public
// app.user(favicon(__name + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// handle express session
app.use(session({
	secret: 'puzzle',
	saveUninitialized: true,
	resave: true
}));

// passport
app.use(passport.initialize());
// passport session middleware
// needs to be located after the express session
app.use(passport.session());

// validator
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		var namespace = param.split('.')
		, root = namespace.shift()
		, formParam = root;
		while(namespace.length) {
			forParam += '[' + namespace.shift() + ']';
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

app.use(cookieParser());

app.use(express.static(__dirname + '/public'));

app.use(flash());
app.use(function(req, res, next) {
	res.locals.messages = require('express-messages')(req, res);
	next();
});

app.get('*', function(req, res, next) {
	res.locals.user = req.user || null;
	next();
});

app.use('/users', users);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not found.');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler, will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		
		req.flash('error', err);
		res.render('error');
	});
}

app.listen(port);
console.log('Connected to port ' + port + '...');
