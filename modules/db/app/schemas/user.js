/*
 *  
 */

// #region dependents

var mongoose = require('mongoose');
var crypto = require('crypto');

// #region initialization

function init() {
    var Schema = mongoose.Schema;

    // #region schemas

    var UserSchema = new Schema({
        name: { type: String, unique: true, required: true },
        hashedPassword: { type: String, required: true },
        salt: { type: String, required: true },
        created: { type: Date, default: Date.now },
        roles: [
            { type: String, required: true }
        ],
        screenName: { type: String }
    });

    // #region configuration functions

    UserSchema.methods.encryptPassword = function (password) {
        return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
        //more secure - return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
    };

    UserSchema.virtual('userId').get(function () {
        return this.id;
    });

    UserSchema.virtual('password')
        .set(function (password) {
            this._plainPassword = password;
            this.salt = crypto.randomBytes(32).toString('base64');
            //more secure - this.salt = crypto.randomBytes(128).toString('base64');
            this.hashedPassword = this.encryptPassword(password);
        })
        .get(function () {
            return this._plainPassword;
        });

    UserSchema.methods.checkPassword = function (password) {
        return this.encryptPassword(password) === this.hashedPassword;
    };

    return UserSchema;
}

// #region private methods

// #region exports

module.exports = init();