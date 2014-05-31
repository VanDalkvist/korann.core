/*
 *  Auth module
 */

// #region dependents

var models = require('db/app');
var errors = require('errors/auth');
var crypto = require('utils/crypto');
var logger = require('log').getLogger(module);
var config = require('config');
var async = require('async');

// #region initialization

function init(app) {
    app.post('/app/auth', appAuth);
    app.post('/user/login', userAuth);
    app.post('/user/logout', userLogout);

    app.all('/api/*', verifyAppAccess);

    logger.debug("Initialization of authentication finished successfully.");
}

// #region private methods

function appAuth(req, res, next) {
    async.waterfall([
        function (callback) {
            var appAuthInfo = { appId: req.body.appId, secretHash: req.body.appSecret, credentials: req.body.cred };

            models.ClientAppModel.findOne({ appId: appAuthInfo.appId }, function findAppCallback(err, clientApp) {
                if (err) return callback(new errors.AuthError(400, err.message));

                if (!clientApp) return callback(new errors.AuthError(401, "Invalid appId."));

                callback(null, clientApp, appAuthInfo);
            });
        },
        function (clientApp, appAuthInfo, callback) {
            checkSecret(appAuthInfo, clientApp, function createSession(err) {
                if (err) return callback(err);

                var accessToken = crypto.createToken(clientApp.appId + clientApp.secret);

                var appSession = new models.AppSessionModel({
                    appId: clientApp.appId,
                    token: accessToken,
                    expired: config.appSession.expires
                });

                callback(null, appSession, clientApp);
            });
        },
        function (appSession, clientApp, callback) {
            appSession.save(function saveCallback(err) {
                if (err) return callback(err);

                logger.debug("Session for app " + clientApp.appId + " saved successfully");

                callback(null, clientApp, appSession);
            });
        },
        function (clientApp, appSession, callback) {
            models.UserSessionModel.find({ appId: clientApp.appId }, function (err, sessions) {
                if (err) return callback(err);

                callback(null, appSession, sessions);
            });
        },
        function (appSession, sessions, callback) {
            res.send({ token: appSession.token, expired: appSession.expires, sessions: sessions });
        }
        
    ], function (err, result) {
        next(err);
    });
}

function userAuth(req, res, next) {
    async.waterfall([
        function (callback) {
            verifyAppAccess(req, res, function verifyCallback(err, credentials) {
                if (err) return callback(err);

                if (!credentials) return callback(new Error("Invalid credentials."));

                callback(null, credentials);
            });
        },
        function (credentials, callback) {
            models.UserModel.findOne({name: credentials.username}, function findUser(err, user) {
                if (err) return callback(err);

                if (!user) return callback(new errors.AuthError(404, "User not found"));

                if (!user.checkPassword(credentials.password)) callback(new errors.AuthError(403, "Invalid password"));

                callback(null, user);
            });
        },
        function saveUser(user, callback) {
            var userSession = new models.UserSessionModel({
                userId: user._id,
                appId: req.body.appId,
                expired: config.userSession.expires,
                context: { username: user.name, roles: user.roles }
            });

            userSession.save(function saveCallback(err) {
                if (err) return callback(err);

                logger.debug("Session for user '" + user.name + "' saved successfully");

                callback(null, userSession);
            });
        },
        function (userSession, callback) {
            res.send({
                sessionId: userSession._id,
                name: userSession.context.username,
                roles: userSession.context.roles,
                expired: userSession.expired
            });
        }
    ], function (err, result) {
        next(err);
    });
}

function userLogout(req, res, next) {
    async.waterfall([
        function (callback) {
            verifyAppAccess(req, res, function verifyCallback(err, credentials) {
                if (err) return callback(err);

                if (!credentials) return callback(new Error("Invalid credentials."));

                callback(null, credentials);
            });
        },
        function (credentials, callback) {
            models.UserSessionModel.findOne({ _id: credentials.sessionId }, function findSession(err, session) {
                if (err) return callback(err);

                if (!session) return callback(new errors.AuthError(401, "Session not found"));

                if (session.token !== credentials.token) return callback(new errors.AuthError(401, "Invalid session token"));

                callback(null, session, credentials);
            });
        },
        function (session, credentials, callback) {
            session.remove(function saveCallback(err) {
                if (err) return callback(err);

                logger.debug("Session for user '" + credentials.username + "' removed successfully");

                callback(null, session);
            });
        },
        function (session) {
            res.send(200, { sessionId: session._id });
        }
    ], function (err) {
        next(err);
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