// #region dependents

var path = require('path');
var express = require('express');
var settings = require('./modules/config');
var logger = require('./modules/log/').getLogger(module);

var app = express();

// #region API initialization

require('./modules/api').init(app);
require('./modules/api/errors').init(app);

// #region environment

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.cookieParser('your secret here'));

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.listen(settings.port, function () {
    logger.info("Hello, app on port " + settings.port);
});