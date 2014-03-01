// #region dependents

var winston = require('winston');
var path = require('path');

// #region initialization

var ENV = process.env.NODE_ENV;

// #region private functions

function getLogger(module) {
    var localPath = module.filename.split(path.sep).slice(-2).join('/');
    return new winston.Logger(getConfig(localPath));
}

function getConfig(path){
    return {
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: ENV == 'development' ? 'debug' : 'error',
                label: path
            })
        ]
    };
}

// #region exports

exports.getLogger = getLogger;