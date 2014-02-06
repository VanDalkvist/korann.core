/*
 * API core
 */

// #region dependencies

var dbConnect = require('db');
var productsAPI = require('./products');

// #region initialization

function init(app) {
    app.get('/api', api);
    var db = dbConnect.init();
    productsAPI.init(app, db);
}

// #region private functions

function api(req, res) {
    res.render('index', { title: 'API' });
}

// #region exports

exports.init = init;