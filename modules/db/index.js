/*
 *  DB Connection
 */

// #region dependents

var mongoose = require('mongoose');
var settings = require('config');
var log = require('log').getLogger(module);

// #region initialization

function init() {
    mongoose.connect(settings.db.connectionString);
    var dbConnection = mongoose.connection;

    dbConnection.on('error', connectionError);
    dbConnection.once('open', connectionEstablished);

    var Schema = mongoose.Schema;
}

// #region private methods 

function connectionError(err) {
    log.error('connection error:', err.message);
}

function connectionEstablished() {
    log.info("Connected to DB!");
}

// #region exports

exports.init = init;