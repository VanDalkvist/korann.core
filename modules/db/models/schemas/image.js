/*
 *  Image schema
 */

// #region dependents

var mongoose = require('mongoose');

// #region initialization

function initSchema() {
    var Schema = mongoose.Schema;

    // #region schema

    var ImageSchema = new Schema({
        kind: {
            type: String,
            enum: ['thumbnail', 'detail'],
            required: true
        },
        url: { type: String, required: true }
    });

    return ImageSchema;
}

// #region private methods

// #region exports

module.exports = initSchema();