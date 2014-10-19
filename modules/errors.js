/*
 *  Auth errors
 */

// #region dependents

var http = require('http');
var util = require('util');

// #region initialization

util.inherits(HttpError, Error);
util.inherits(NotFoundError, HttpError);

HttpError.prototype.name = "HttpError";
//NotFoundError.prototype.name = "NotFoundError";

// #region private methods

function _applyBase(args, context, errorFunc) {
    Error.apply(context, args);
    Error.captureStackTrace(context, errorFunc);
}

function HttpError(code, message, callback) {
    _applyBase(arguments, this, HttpError);

    this.code = code;
    this.message = message || http.STATUS_CODES[code] || "Uncaught error.";
}

function NotFoundError(code, message, callback) {
    _applyBase(arguments, this, NotFoundError);

    this.code = 404;
    this.message = "Not found.";
}

// #region exports

exports.HttpError = HttpError;
exports.NotFoundError = NotFoundError;