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
var auth = require('auth');
var api = require('api');

// #region initialization

function init() {
    var app = express();
    app.listen(config.port, listenCallback);

    // todo: add modules interceptors

    // #region configuration

    // todo: use my train module

    environment.init(app);
    dbconnect.init();
    auth.init(app);
    api.init(app);
    routes.init(app);
    errors.init(app);

    // todo: add singleton support
    return app;
}

// #region private methods

function listenCallback() {
    logger.debug("Hello, I'm app on port " + config.port + " ...");
}

// #region exports

exports.create = init;