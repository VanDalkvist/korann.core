/*
 *  Auth errors
 */

// #region dependents

var http = require('http');
var util = require('util');

// #region initialization

function HttpError(code, message, callback) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, HttpError);

    this.code = code;
    this.message = message || http.STATUS_CODES[code] || "Uncaught error";
}

// #region private methods

util.inherits(HttpError, Error);

HttpError.prototype.name = "HttpError";

// #region exports

exports.HttpError = HttpError;