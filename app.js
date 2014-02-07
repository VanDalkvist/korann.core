// #region dependents

var path = require('path');
var http = require('http');
var express = require('express');
var settings = require('config');
var logger = require('log').getLogger(module);

var app = express();

// todo: add modules interceptors

http.createServer(app).listen(settings.port, function () {
    logger.debug("Hello, I'm app on port " + settings.port + "...");
});

// #region environment
// todo: create environment module and move configuring there

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// #region default express middleware

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.cookieParser('your secret here'));

// #region routes

// todo: create routes module and move configuring there

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// #region API initialization

require('api').init(app);

// #region error handling

require('api/errors').init(app);
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}