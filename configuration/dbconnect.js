/*
 *  DB connection
 */

// #region dependents
var dbConnect = require('db');
var logger = require('log').getLogger(module);

// #region initialization

function init() {
    // todo: add several connection attempt

    dbConnect.init();
}

// #region exports

exports.init = init;