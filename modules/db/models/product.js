/*
 *  Product model
 */

// #region dependents

var mongoose = require('mongoose');
var ImageSchema = require('./schemas/image');

// #region initialization

function initModel() {
    var Schema = mongoose.Schema;

    // #region schemas

    var ProductSchema = new Schema({
        name: { type: String, required: true },
        screenName: { type: String, required: true },
        source: {type: String, required: true },
        category: { type: String, required: true },
        description: { type: String, required: true },
        images: [ImageSchema]
    });

    // #region validation

    ProductSchema.path('name').validate(nameValidate);

    // #region model

    return mongoose.model('Product', ProductSchema);
}

// #region private methods

function nameValidate(value) {
    return value.length > 5 && value.length < 70;
}

// #region exports

module.exports = initModel();