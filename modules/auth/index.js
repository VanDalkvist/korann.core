/*
 *  Auth module
 */

// #region dependents

var models = require('db/app');
var errors = require('errors');
var crypto = require('utils/crypto');
var logger = require('log').getLogger(module);
var config = require('config');
var async = require('async');

// #region initialization

function init(app) {
    app.post('/app/auth', _appAuth);
    app.post('/user/login', _userSignIn);
    app.post('/user/logout', _userSignOut);

    app.all('/api/*', _verifyAppAccess, _verifyUserAccess);

    logger.debug("Initialization of authentication finished successfully.");
}

// #region private methods

function _appAuth(req, res, next) {
    async.waterfall([
        function (callback) {
            var appAuthInfo = { appId: req.body.appId, secretHash: req.body.appSecret };

            models.ClientAppModel.findOne({ appId: appAuthInfo.appId }, function findAppCallback(err, clientApp) {
                if (err) return callback(new errors.HttpError(400, err.message));

                if (!clientApp) return callback(new errors.HttpError(401, "Invalid appId."));

                callback(null, clientApp, appAuthInfo);
            });
        },
        function (clientApp, appAuthInfo, callback) {
            _checkSecret(appAuthInfo, clientApp, function createSession(err) {
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

function _userSignIn(req, res, next) {
    async.waterfall([
        function (callback) {
            _verifyAppAccess(req, res, function verifyCallback(err) {
                if (err) return callback(err);

                var credentials = req.body.cred;

                if (!credentials) return callback(new errors.HttpError(400, "Invalid credentials."));

                callback(null, credentials);
            });
        },
        function (credentials, callback) {
            models.UserModel.findOne({name: credentials.username}, function findUser(err, user) {
                if (err) return callback(err);

                if (!user) return callback(new errors.NotFoundError());

                if (!user.checkPassword(credentials.password)) return callback(new errors.HttpError(401, "Invalid password."));

                callback(null, user);
            });
        },
        function saveUser(user, callback) {
            var userSession = new models.UserSessionModel({
                userId: user._id,
                appId: req.headers.appid,
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

function _userSignOut(req, res, next) {
    async.waterfall([
        function (callback) {
            _verifyAppAccess(req, res, function verifyCallback(err) {
                if (err) return callback(err);

                var credentials = req.body.cred;

                if (!credentials) return callback(new errors.HttpError(401, "Invalid credentials."));

                callback(null, credentials);
            });
        },
        function (credentials, callback) {
            models.UserSessionModel.findOne({ _id: credentials.sessionId }, function findSession(err, session) {
                if (err) return callback(err);

                if (!session) return callback(new errors.HttpError(401, "Session not found"));

                if (session.token !== credentials.token) return callback(new errors.HttpError(401, "Invalid session token"));

                callback(null, session, credentials);
            });
        },
        function (session, credentials, callback) {
            session.remove(function saveCallback(err) {
                if (err) return callback(err);

                logger.debug("Session for user '" + credentials.name + "' removed successfully");

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

function _checkSecret(authInfo, clientApp, next) {
    var secretHash = calculateHash(clientApp.secret);
    if (secretHash !== authInfo.secretHash)
        return next(new errors.HttpError(401, "Invalid authentication data."));

    next(null, clientApp);
}

function calculateHash(secret) {
    return secret;
}

function _verifyAppAccess(req, res, next) {
    var appInfo = { appId: req.headers.appid, accessToken: req.headers.token };

    if (!appInfo.appId || !appInfo.accessToken) return next(new errors.HttpError(401, "Invalid app credentials."));

    models.AppSessionModel.findOne({ appId: appInfo.appId }, function findSession(err, appSession) {
        if (err) return next(err);

        if (!models.AppSessionModel.checkSecret(appInfo.accessToken))
            return next(new errors.HttpError(401, "Invalid app credentials."));

        next(null, appInfo.credentials);
    });
}

function _verifyUserAccess(req, res, next) {
    var userSessionInfo = {
        sessionId: req.headers.session,
        sessionToken: req.headers.sessionToken
    };

    if (!userSessionInfo.sessionId) return next(new errors.HttpError(401, "Invalid user session."));

    models.UserSessionModel.findOne({ _id: userSessionInfo.sessionId }, function findSession(err, session) {
        if (err) return next(new errors.HttpError(500, err.message));

        if (!session) return next(new errors.HttpError(401, "Session not found."));

        if (session.token !== userSessionInfo.sessionToken) return next(new errors.HttpError(401, "Invalid session token."));

        next(null, session, userSessionInfo);
    });
}

// #region exports

exports.init = init;