/*
 *  Application models
 */

// #region dependents

var ClientAppModel = require('./models/clientApp');
var UserModel = require('./models/user');
var AppSessionModel = require('./models/appSession');
var UserSessionModel = require('./models/userSession');

// #region initialization

function init() {
    return {
        ClientAppModel: ClientAppModel,
        AppSessionModel: AppSessionModel,
        UserModel: UserModel,
        UserSessionModel: UserSessionModel
    };
}
// #region exports

module.exports = init();