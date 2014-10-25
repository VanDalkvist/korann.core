// #region dependents

var winston = require('winston');
var path = require('path');

// #region initialization

var ENV = process.env.NODE_ENV;

// #region private functions

function getLogger(module) {
    var localPath = module.filename.split(path.sep).slice(-2).join('/');
//    winston.handleExceptions(new winston.transports.File({ filename: 'exceptions.log' }));
    return new winston.Logger(getConfig(localPath));
}

function getConfig(path) {
    return {
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: ENV == 'development' ? 'debug' : 'error',
                timestamp: true,
                label: path
            }),
            new winston.transports.File({
                level: 'debug',
                filename: 'debug.log',
                colorize: true,
                name: 'file.all',
                maxsize: 1000000,
                prettyPrint: true,
                json: false,
                handleExceptions: true
            }),
            new winston.transports.File({
                level: 'error',
                filename: 'errors.log',
                colorize: true,
                prettyPrint: true,
                json: false,
                maxsize: 1000000,
                handleExceptions: true
            })
        ]
    };
}

// #region exports

exports.getLogger = getLogger;