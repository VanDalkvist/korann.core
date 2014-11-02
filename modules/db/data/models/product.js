/*
 *  Product model
 */

// #region dependents

var mongoose = require('mongoose');
var ImageSchema = require('../schemas/image');

// #region initialization

function initModel() {
    var Schema = mongoose.Schema;

    // #region schemas

    var ProductSchema = new Schema({
        name: { type: String, required: true },
        category: {
            name: { type: String, required: true },
            id: { type: String, required: true }
        },
        description: { type: String, required: true },
        brand: { type: String, required: true },
        price: { type: Number, required: true },
        volume: { type: Number, required: true },
        images: [ ImageSchema ]
    });

    // #region validation

    // #region model

    return mongoose.model('Product', ProductSchema);
}

// #region private methods

// #region exports

module.exports = initModel();