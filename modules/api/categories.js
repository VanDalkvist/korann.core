/*
 *  Categories API
 */

// #region dependents

// #region initialization

function init(app, db) {
    app.get('/api/categories', function (req, res) {
        // not implemented
        res.send([
            'category1', 'category2', 'category3', 'category4', 'category5', 'category6', 'category7', 'category8', 'category9',
        ]);
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