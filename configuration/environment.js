/*
 *  Environment
 */

// #region dependents

var path = require('path');
var express = require('express');
var settings = require('config');

// #region initialization

function init(app) {
    app.set('views', path.join(settings.root, 'views'));
    app.set('view engine', 'jade');

// #region default express middleware

    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.cookieParser('your secret here'));
}

// #region private methods

// #region exports

exports.init = init;