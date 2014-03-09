/*
 *  Errors
 */

// #region dependents

var logger = require('log').getLogger(module);
var errorHandler = require('express-error').express3({contextLinesCount: 3, handleUncaughtException: true});

// #region initialization

function init(app) {
    app.use(notFoundError);
//    app.use(internalError);

    // todo: extract 'development' type to config env type;
    app.configure('development', function () {
        app.use(internalError);
    });
}

// #region private functions

function notFoundError(req, res) {
    res.status(404);
    logger.debug('Not found URL: %s', req.url);
    res.render('404');
}

function internalError(err, req, res, next) {
    var code = err.code || res.statusCode || 500;
    res.status(code);
    logger.error('Internal error: { code: %d, message: %s, stack: %s }', code, err.error || err.message, err.stack);
    errorHandler(err, req, res, next);
}

// #region exports

exports.init = init;