/*
 * API core
 */

// #region initialization

function init(app) {
    app.get('/api', api);
    app.get('/', index);
}

// #region private functions

function api(req, res) {
    res.render('index', { title: 'API' });
}

function index(req, res) {
    res.render('index', { title: 'Express' });
}

// #region exports

exports.init = init;