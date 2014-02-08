/*
 *  Sessions
 */

// #region dependents

var express = require('express');
var connect = require('connect-mongo');
var config = require('config');
var mongoose = require('mongoose');
var logger = require('log').getLogger(module);

// #region initialization

function init(app) {
    var MongoStore = connect(express);
    var sessionSettings = config.session;

    var options = {
        secret: sessionSettings.secret,
        key: sessionSettings.key,
        cookie: sessionSettings.cookie,
        store: new MongoStore({
            mongoose_connection: mongoose.connection,
            stringify: false
        })
    };

    // #region middleware

    logger.debug("Initialization of mongodb session support... ");
    app.use(express.session(options));
}

// #region exports

exports.init = init;