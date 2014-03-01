/*
 *  List of API models
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

// #region exports

module.exports = init();