// #region dependents

var winston = require('winston');

// #region initialization

var ENV = process.env.NODE_ENV;

// #region private functions

function getLogger(module) {
    var path = module.filename.split('/').slice(-2).join('/');
    return new winston.Logger(getConfig(path));
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