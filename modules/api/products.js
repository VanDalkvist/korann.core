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
        return ProductModel.findById(req.params.id, function (err, product) {
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
                return validationError(err, res);
            }

            return internalError(err, res);
        });
    });

    app.put('/api/products/:id', function (req, res) {
        return ProductModel.findById(req.params.id, function (err, product) {
            if (!product) return notFound(res);

            // todo: use mapper

            product.name = req.body.name;
            product.description = req.body.description;
            product.category = req.body.category;
            product.images = req.body.images;
            product.brand = req.body.brand;

            return product.save(function saveCallback(err) {
                if (err) {
                    if (err.name == 'ValidationError') return validationError(res);

                    return internalError(err, res);
                } else {
                    logger.info("product updated");
                    return success(res, product);
                }
            });
        });
    });

    app.delete('/api/products/:id', function (req, res) {
        return ProductModel.findById(req.params.id, function (err, product) {
            if (err) return internalError(err, res);

            if (!product) return notFound(res);

            return product.remove(function (err) {
                if (err) return internalError(err, res);

                logger.info("product removed");
                return success(res);
            });
        });
    });
}

// #region private methods

// todo: move to custom errors
function success(res, data) {
    return res.send({ status: '200', data: data });
}

function internalError(err, res) {
    var statusCode = 500;

    res.statusCode = statusCode;
    logger.error('Internal error(%d): %s', res.statusCode, err.message);
    return res.send({ error: {status: statusCode, message: 'Server error'} });
}

function notFound(res) {
    res.statusCode = 404;
    logger.error('Not found error(%d): %s', res.statusCode, 'Not found');
    return res.send({ error: { status: res.statusCode, message: 'Not found' } });
}

function validationError(err, res) {
    res.statusCode = 400;
    logger.error('Validation error(%d): %s', res.statusCode, 'Validation error' + err.message);
    return res.send({ error: { status: res.statusCode, message: 'Validation error: ' + err.message } });
}

// #region exports

exports.init = init;