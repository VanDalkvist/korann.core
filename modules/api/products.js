/*
 *  Products API
 */

// #region dependents

var logger = require('log').getLogger(module);

// #region initialization

function init(app, models) {
    var ProductModel = models.ProductModel;

    app.get('/api/products', getAll);
    app.get('/api/products/:id', getById);
    app.post('/api/products', create);
    app.put('/api/products/:id', update);
    app.delete('/api/products/:id', remove);

    function getAll(req, res) {
        return ProductModel.find({ }, function (err, products) {
            if (err) return internalError(err, res);

            return success(res, products);
        });
    }

    function getById(req, res) {
        return ProductModel.findById(req.params.id, function (err, product) {
            if (err) return internalError(err, res);

            return success(res, product);
        });
    }

    function create(req, res) {
        // todo: add validation and delete default value
        var newProduct = req.body;

        var product = new ProductModel({
            title: newProduct.title,
            category: newProduct.category || "category",
            description: newProduct.description || "desc",
            source: "kora",
            images: newProduct.images
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
    }

    function update(req, res) {
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
                }

                logger.info("product updated");
                return success(res, product);
            });
        });
    }

    function remove(req, res) {
        // todo: add async waterfall
        return ProductModel.findById(req.params.id, function (err, product) {
            if (err) return internalError(err, res);

            if (!product) return notFound(res);

            return product.remove(function (err) {
                if (err) return internalError(err, res);

                logger.info("product removed");
                return success(res);
            });
        });
    }
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