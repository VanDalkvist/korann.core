/*
 *  Category model
 */

// #region dependents

var mongoose = require('mongoose');
var ImageSchema = require('../schemas/image');

// #region initialization

function initModel() {
    var Schema = mongoose.Schema;

    // #region schemas

    var CategorySchema = new Schema({
        name: { type: String, required: true },
        images: [ ImageSchema ],
        description: { type: String, required: false }
    });

    // #region model

    return mongoose.model('Category', CategorySchema);
}

// #region private methods

// #region exports

module.exports = initModel();