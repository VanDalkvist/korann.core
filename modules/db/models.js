/*
 *  Models
 */

// #region dependents
var ProductModel = require('./models/product');
var CategoryModel = require('./models/category');

// #region initialization

function init() {
    return {
        ProductModel: ProductModel,
        CategoryModel: CategoryModel
    };
}

// #region private methods 


// #region exports

exports.init = init;