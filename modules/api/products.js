/*
 *  Products API
 */

// #region dependents

// #region initialization

function init(app, db) {
    app.get('/api/products', function (req, res) {
        res.send({response: "GET /api/products"});
    });

    app.post('/api/products', function (req, res) {
        res.send({ response: "POST /api/products" });
    });

    app.get('/api/products/:id', function (req, res) {
        res.send({response: "GET /api/products/:id"});
    });

    app.put('/api/products/:id', function (req, res) {
        res.send({response: "PUT /api/products/:id"});
    });

    app.delete('/api/products/:id', function (req, res) {
        res.send({response: "DELETE /api/products/:id"});
    });
}

// #region private methods

// #region exports

exports.init = init;