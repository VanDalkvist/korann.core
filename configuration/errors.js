/*
 *  Errors
 */

// #region dependents

var logger = require('log').getLogger(module);
var config = require('config');

// #region initialization

function init(app) {
    app.use(notFoundError);
    app.use(internalError);

    // todo: extract 'development' type to config env type;
    (config.env === 'development') && app.use(express.errorHandler());
}

// #region private functions

function notFoundError(req, res) {
    res.status(404);
    logger.debug('Not found URL: %s', req.url);
    res.render('404');
}

function internalError(err, req, res, next) {
    res.status(err.status || 500);
    logger.error('Internal error(%d): %s %s', res.statusCode, err.message, err.stack);
    res.send({ error: err.message });
}

// #region exports

exports.init = init;