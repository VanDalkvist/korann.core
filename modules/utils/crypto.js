/*
 *  Generator
 */

// #region dependents
var crypto = require('crypto');

// #region initialization

function randomString(size) {
    return crypto.randomBytes(size).toString('base64');
}

function createToken(string) {
    return string; // todo: generate token
}

// #region private methods 

// #region exports

exports.randomString = randomString;
exports.createToken = createToken;