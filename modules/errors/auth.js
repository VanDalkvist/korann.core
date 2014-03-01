/*
 *  Auth errors
 */

// #region dependents

var http = require('http');
var util = require('util');

// #region initialization

function AuthError(status, message, callback) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, AuthError);

    this.message = message || http.STATUS_CODES[status] || "Error";
}

// #region private methods

util.inherits(AuthError, Error);

AuthError.prototype.name = "AuthError";

// #region exports

exports.AuthError = AuthError;