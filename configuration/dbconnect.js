/*
 *  DB connection
 */

// #region dependents
var dbConnect = require('db');
var logger = require('log').getLogger(module);
var config = require('config');

// #region initialization

function init() {
    // todo: add several connection attempt

    dbConnect.init(config);
}

// #region exports

exports.init = init;