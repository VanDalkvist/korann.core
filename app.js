/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./modules/api');
var user = require('./modules/api/user');
var path = require('path');
var logger = require('./modules/log/')(module);
var config = require('./modules/config');

var app = express();

// init error handlers
require('./modules/api/errors')(app);

// environment
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.cookieParser('your secret here'));

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


var settings = {
    port: config.get('port')
};

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/api', function (req, res) {
    res.render('index', { title: 'API' });
});

// init error handlers
require('./modules/api/errors')(app);

app.listen(settings.port, function () {
    logger.info("Hello, app on port " + settings.port);
});
