/*
 *  DB Connection
 */

// #region dependents

var mongoose = require('mongoose');
var settings = require('config');
var logger = require('log').getLogger(module);

// #region initialization

function init() {
    mongoose.connect(settings.db.connectionString);
    var dbConnection = mongoose.connection;

    dbConnection.on('error', connectionError);

    logger.info("Initialization connection to DB '" + dbConnection.name + "' ...");
    dbConnection.once('open', function connectionEstablished() {
        logger.info("Connected to db '" + dbConnection.name + "' established.");
    });
}

// #region private methods 

function connectionError(err) {
    logger.error('Connection error: ', err.message);
    throw err;
}

// #region exports

exports.init = init;