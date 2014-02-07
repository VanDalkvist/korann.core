/*
 *  Categories API
 */

// #region dependents

// #region initialization

function init(app, db) {
    app.get('/api/categories', function (req, res) {
        res.send({response: "GET /api/categories"}); // not implemented
    });

    app.post('/api/categories', function (req, res) {
        res.send({ response: "POST /api/categories" }); // not implemented
    });

    app.get('/api/categories/:id', function (req, res) {
        res.send({response: "GET /api/categories/:id"}); // not implemented
    });

    app.put('/api/categories/:id', function (req, res) {
        res.send({response: "PUT /api/categories/:id"}); // not implemented
    });

    app.delete('/api/categories/:id', function (req, res) {
        res.send({response: "DELETE /api/categories/:id"}); // not implemented
    });
}

// #region private methods

// #region exports

exports.init = init;