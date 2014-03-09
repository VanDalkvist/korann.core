/*
 *  User model
 */

// #region dependents

var mongoose = require('mongoose');
var crypto = require('crypto');

// #region initialization

function initModel() {
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

    // #region model

    return mongoose.model('User', UserSchema);
}

// #region private methods

// #region exports

module.exports = initModel();

//
//var mongoose = require('mongoose'),
//    crypto = require('crypto');
//
//
//module.exports = function (app) {
//
//    var UserSchema = new mongoose.Schema({
//        username: { type: String, required: true, unique: true},
//        hashed_password: {type: String, required: true},
//        salt: {type: String, required: true}
//    });
//
//    UserSchema.virtual('password')
//        .set(function (password) {
//            this._password = password;
//            this.salt = this.makeSalt();
//            this.hashed_password = this.encryptPassword(password);
//        })
//        .get(function () {
//            return this._password;
//        });
//
//    UserSchema.method('authenticate', function (plainText) {
//        console.log('authenticate called:')
//        console.log('plain text = ' + plainText)
//        console.log('hashed = ' + this.encryptPassword(plainText))
//        console.log('db password= ' + this.hashed_password)
//        return this.encryptPassword(plainText) === this.hashed_password;
//    });
//
//    UserSchema.method('makeSalt', function () {
//        return Math.round((new Date().valueOf() * Math.random())) + '';
//    });
//
//    UserSchema.method('encryptPassword', function (password) {
//        return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
//    });
//
//    UserSchema.method('generateToken', function () {
//        return crypto.createHash('md5').update(this.username + Date().toString()).digest("hex");
//    });
//
//    UserSchema.pre('save', function (next) {
//
//        this.token = this.generateToken();
//
//        if (!validatePresenceOf(this.password || this.hashed_password)) {
//            next(new Error('Invalid password'));
//        } else {
//            next();
//        }
//    });
//
//    return mongoose.model('User', UserSchema);
//
//}
//
//function validatePresenceOf(value) {
//    return value && value.length;
//}