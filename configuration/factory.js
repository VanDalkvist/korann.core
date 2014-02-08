/*
 *  Factory
 */

// #region dependents

var http = require('http');
var express = require('express');
var config = require('config');
var logger = require('log').getLogger(module);
var environment = require('./environment');
var routes = require('./routes');
var errors = require('./errors');

// #region initialization

function init() {
    var app = express();
    var server = http.createServer(app);

    server.listen(config.port, serverCallback);

    // #region configuration

    // todo: add modules interceptors

    environment.init(app);
    routes.init(app);
    errors.init(app);

    // todo: add singleton support
    return app;
}

// #region private methods

function serverCallback() {
    logger.debug("Hello, I'm app on port " + config.port + " ...");
}

// #region exports

exports.create = init;