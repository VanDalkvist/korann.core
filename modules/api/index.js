/*
 * API core
 */

// #region dependencies

var api = {
    products: require('./products'),
    categories: require('./categories')
};

var logger = require('log').getLogger(module);
var models = require('db/data');

// #region initialization

function init(app) {
    app.get('/api', apiIndex);

    for (var key in api) {
        api[key].init(app, models);
        logger.debug("Initialization of " + key + " API module finished successfully.");
    }
}

// #region private functions

function apiIndex(req, res) {
    res.render('index', { title: 'API' });
}

// #region exports

exports.init = init;