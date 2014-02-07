/*
 *  DB Connection
 */

// #region dependents

var mongoose = require('mongoose');
var settings = require('config');
var logger = require('log').getLogger(module);
var ProductModel = require('./models/product');
var CategoryModel = require('./models/category');

// #region initialization

function init() {
    mongoose.connect(settings.db.connectionString);
    var dbConnection = mongoose.connection;

    dbConnection.on('error', connectionError);

    logger.info("Initialization connection to DB...");
    dbConnection.once('open', connectionEstablished);

    return {
        ProductModel: ProductModel,
        CategoryModel: CategoryModel
    };
}

// #region private methods 

function connectionError(err) {
    logger.error('connection error:', err.message);
    throw err;
}

function connectionEstablished() {
    logger.info("Connected to db established.");
}

// #region exports

exports.init = init;