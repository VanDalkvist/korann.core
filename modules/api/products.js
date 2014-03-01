/*
 *  Products API
 */

// #region dependents

var logger = require('log').getLogger(module);

// #region initialization

function init(app, models) {

    var ProductModel = models.ProductModel;

    app.get('/api/products', function (req, res) {
        return ProductModel.find({}, function (err, products) {
            if (err) return internalError(err, res);

            return products;
        });
    });

    app.get('/api/products/:id', function (req, res) {
        return ProductModel.find({ _id: req.params.id }, function (err, product) {
            if (err) return internalError(err, res);

            return product;
        });
    });

    app.post('/api/products', function (req, res) {
        // todo: add validation and delete default value
        var product = new ProductModel({
            title: req.body.title,
            category: req.body.category || "category",
            description: req.body.description || "desc",
            source: "kora",
            images: req.body.images
        });

        product.save(function productSaveCallback(err, product) {
            if (!err) {
                logger.info("Product created: " + product);
                return success(res, product);
            }

            if (err.name == 'ValidationError') {
                res.statusCode = 400;
                res.send({ error: 'Validation error' });
            } else internalError(err, res);

            log.error('Internal error(%d): %s', res.statusCode, err.message);
        });
    });

    app.put('/api/products/:id', function (req, res) {
        res.send({response: "PUT /api/products/:id"}); // not implemented
    });

    app.delete('/api/products/:id', function (req, res) {
        res.send({response: "DELETE /api/products/:id"}); // not implemented
    });
}

// #region private methods

// todo: move to shared module
function success(res, data) {
    return res.send({ status: '200', data: data });
}

// todo: move to errors module
function internalError(err, res) {
    var statusCode = 500;

    res.statusCode = statusCode;
    logger.error('Internal error(%d): %s', res.statusCode, err.message);
    return res.send({ error: {status: statusCode, message: 'Server error'} });
}

// #region exports

exports.init = init;