/*
 *  Routes
 */

// #region dependents
var path = require('path');
var express = require('express');
var logger = require('log').getLogger(module);
var config = require('config');

// #region initialization

function init(app) {
    // todo: add log initialization message
    app.use(app.router);
    app.use(express.static(path.join(config.root, 'public')));
}

// #region exports

exports.init = init;