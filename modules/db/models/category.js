/*
 *  Category model
 */

// #region dependents

var mongoose = require('mongoose');
var ImageSchema = require('./schemas/image');

// #region initialization

function initModel() {
    var Schema = mongoose.Schema;

    // #region schemas

    var CategorySchema = new Schema({
        name: { type: String, required: true },
        screenName: { type: String, required: true },
        categories: [CategorySchema],
        images: [ImageSchema]
    });

    // #region model

    var model = mongoose.model('Category', CategorySchema);
    return  model;
}

// #region private methods

// #region exports

module.exports = initModel();