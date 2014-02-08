// #region dependents

var factory = require('./configuration/factory');

// create our type of application
var app = factory.create();

// #region API initialization

require('api').init(app);
