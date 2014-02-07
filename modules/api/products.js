/*
 *  Products API
 */

// #region dependents

// #region initialization

function init(app, db) {
    app.get('/api/products', function (req, res) {
        res.send({response: "GET /api/products"}); // not implemented
    });

    app.post('/api/products', function (req, res) {
        res.send({ response: "POST /api/products" }); // not implemented
    });

    app.get('/api/products/:id', function (req, res) {
        res.send({response: "GET /api/products/:id"}); // not implemented
    });

    app.put('/api/products/:id', function (req, res) {
        res.send({response: "PUT /api/products/:id"}); // not implemented
    });

    app.delete('/api/products/:id', function (req, res) {
        res.send({response: "DELETE /api/products/:id"}); // not implemented
    });
}

// #region private methods

// #region exports

exports.init = init;