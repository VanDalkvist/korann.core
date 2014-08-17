/*
 *  Errors
 */

// #region dependents

var logger = require('log').getLogger(module);

// #region initialization

function init(app) {
    app.use(notFoundError);

    // todo: extract 'development' type to config env type;
    app.use(internalError);
}

// #region private functions

function notFoundError(req, res) {
    var code = 404;
    // todo: fix two errors occurring;
    logger.debug('Not found URL: %s', req.url);
    res.send(code, { error: { code: code, message: "Not found" }});
    res.render('404');
}

function internalError(err, req, res, next) {
    var code = err.code || 500;
    res.send(code, { error: { code: code, message: err.message }});
    logger.error('Error: { code: %d, message: %s, stack: %s }', code, err.error || err.message, err.stack);
}

// #region exports

exports.init = init;