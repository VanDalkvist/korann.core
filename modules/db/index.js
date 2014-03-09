/*
 *  DB Connection
 */

// #region dependents

var mongoose = require('mongoose');
var logger = require('log').getLogger(module);

// #region initialization

function init(settings, onConnectionEstablish) {
    mongoose.connect(settings.db.connectionString);
    var dbConnection = mongoose.connection;

    dbConnection.on('error', connectionError);

    dbConnection.once('open', function connectionEstablished() {
        logger.debug("Connection to db '" + dbConnection.name + "' established.");

        if (onConnectionEstablish) onConnectionEstablish();
    });
}

// #region private methods 

function connectionError(err) {
    logger.error('Connection error: ', err.message);
    throw err;
}

// #region exports

exports.init = init;