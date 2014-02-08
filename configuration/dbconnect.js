/*
 *  DB connection
 */

// #region dependents
var dbConnect = require('db');
var logger = require('log').getLogger(module);

// #region initialization

function init() {
    // todo: add several connection attempt

    logger.debug("Initialization of mongodb connection... ");
    dbConnect.init();
}

// #region exports

exports.init = init;