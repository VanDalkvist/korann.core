/*
 *  Factory
 */

// #region dependents

var express = require('express');
var config = require('config');
var logger = require('log').getLogger(module);

var environment = require('./environment');
var routes = require('./routes');
var errors = require('./errors');
var dbconnect = require('./dbconnect');
var sessions = require('./sessions');
var auth = require('auth');
var api = require('api');

// #region initialization

function init() {
    var app = express();
    app.listen(config.port, listenCallback);

    // todo: add modules interceptors

    // #region configuration

    environment.init(app);
    dbconnect.init();
    sessions.init(app);
    routes.init(app);
    auth.init(app);
    errors.init(app);
    api.init(app);

    // todo: add singleton support
    return app;
}

// #region private methods

function listenCallback() {
    logger.debug("Hello, I'm app on port " + config.port + " ...");
}

// #region exports

exports.create = init;