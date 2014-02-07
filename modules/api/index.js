/*
 * API core
 */

// #region dependencies

var dbConnect = require('db');
var api = {
    products: require('./products'),
    categories: require('./categories')
};
var logger = require('log').getLogger(module);

// #region initialization

function init(app) {
    app.get('/api', apiIndex);

    // connection to db
    var db = dbConnect.init(); // todo: add several connection attempt

    for (var key in api) {
        logger.debug("Initialization of " + key + " API module...");
        api[key].init(app, db);
        logger.debug("Initialization of " + key + " API module finished successfully.");
    }
}

// #region private functions

function apiIndex(req, res) {
    res.render('index', { title: 'API' });
}

// #region exports

exports.init = init;