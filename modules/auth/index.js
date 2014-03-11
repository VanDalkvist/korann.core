/*
 *  Auth module
 */

// #region dependents

var models = require('db/app');
var errors = require('errors/auth');
var crypto = require('utils/crypto');
var logger = require('log').getLogger(module);

// #region initialization

function init(app) {
    app.post('/app/auth', appAuth);
    app.post('/user/login', userAuth);
    app.all('/api/*', verifyAppAccess);

    logger.debug("Initialization of authentication finished successfully.");
}

// #region private methods

function appAuth(req, res, next) {
    var appAuthInfo = {
        appId: req.body.appId,
        secretHash: req.body.appSecret,
        credentials: req.body.cred
    };

    models.ClientAppModel.findOne({appId: appAuthInfo.appId}, function findAppCallback(err, clientApp) {
        if (err) return next(new errors.AuthError(400, err.message));

        if (!clientApp) return next(new errors.AuthError(401, "Invalid appId."));

        checkSecret(appAuthInfo, clientApp, function createSession(err) {
            if (err) return next(err);

            var accessToken = crypto.createToken(clientApp.appId + clientApp.secret);

            var appSession = new models.AppSessionModel({
                appId: clientApp.appId,
                token: accessToken,
                expired: Date.now() // todo: set expired time
            });

            appSession.save(function saveCallback(err) {
                if (err) return next(err);

                logger.debug("Session for app " + clientApp.appId + " saved successfully");

                res.send({ token: appSession.token });
            });
        });
    });
}

function userAuth(req, res, next) {
    verifyAppAccess(req, res, function verifyCallback(err, credentials) {
        if (err) return next(err);

        if (!credentials)
            return next(new Error("Invalid credentials."));

        models.UserModel.findOne({name: credentials.username}, function findUser(err, user) {
            if (err) return next(err);

            if (!user) return next(new errors.AuthError(404, "User not found"));

            if (!user.checkPassword(credentials.password))
                next(new Error("Invalid password"));

            var userToken = "xxxx"; // todo: generate user token
            var userSession = new models.UserSessionModel({
                userId: user._id,
                token: 'zsdrhxrlkgsderjkgnbziserxBOZIUSREBG',
                expired: Date.now()
            }); //todo: set expired time

            userSession.save(function saveCallback(err) {
                if (err) return next(err);

                logger.debug("Session for user '" + user.name + "' saved successfully");

                res.send({
                    name: user.name,
                    roles: user.roles,
                    token: userSession.token
                });
            });
        });
    });
}

function checkSecret(authInfo, clientApp, next) {
    var secretHash = calculateHash(clientApp.secret);
    if (secretHash !== authInfo.secretHash)
        return next(new errors.AuthError(400, "Invalid authentication data: secret"));

    next(null, clientApp);
}

function calculateHash(secret) {
    return secret;
}

function verifyAppAccess(req, res, next) {
    var appInfo = {
        appId: req.body.appId,
        accessToken: req.body.token,
        credentials: req.body.cred
    };

    if (!appInfo.appId || !appInfo.accessToken) return next(new errors.AuthError(401, "Invalid appId"));

    models.AppSessionModel.findOne({appId: appInfo.appId}, function findSession(err, appSession) {
        if (err) return next(err);

        if (appSession.token !== appInfo.accessToken)
            return next(new errors.AuthError(401, "Invalid access token."));

        next(null, appInfo.credentials);
    });
}

// #region exports

exports.init = init;