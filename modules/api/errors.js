// #region dependents

var logger = require('log').getLogger(module);

// #region initialization

function init(app) {
    app.use(notFoundError);
    app.use(internalError);
}

// #region private functions

function notFoundError(req, res) { // todo: investigate error handling
    res.status(404);
    logger.debug('Not found URL: %s', req.url);
    res.render('404');
}

function internalError(err, req, res, next) {
    res.status(err.status || 500);
    logger.error('Internal error(%d): %s', res.statusCode, err.message);
    res.send({ error: err.message });
};

// #region exports

exports.init = init;