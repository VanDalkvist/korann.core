/*
 *  Environment
 */

// #region dependents

var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');
var methodOverride = require('method-override');
var config = require('config');

// #region initialization

function init(app) {
    app.set('views', path.join(config.root, 'views'));
    app.set('view engine', 'jade');

// #region default express middleware
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(expressValidator());
    app.use(methodOverride());
    app.use(cookieParser());
}

// #region private methods

// #region exports

exports.init = init;