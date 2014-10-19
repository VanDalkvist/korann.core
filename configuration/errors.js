/*
 *  Errors
 */

// #region dependencies

var logger = require('log').getLogger(module);
var errors = require('errors');

// #region initialization

function init(app) {
    app.use(httpError);
    app.use(internalError);
}

// #region private functions

function httpError(err, req, res, next) {
    if (err.name !== 'HttpError') return next(err);

    logger.error('Http error: %s', req.url);
    res.status(err.code).send({ error: { code: err.code, message: err.message }});
}

function internalError(err, req, res, next) {
    var code = err.code || 500;
    res.status(err.code).send({ error: { code: code, message: err.message }});
    logger.error('Internal Error: { code: %d, message: %s, stack: %s }', code, err.error || err.message, err.stack);
}

// #region exports

exports.init = init;