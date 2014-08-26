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
            if (err) {
                if (err.name == 'ValidationError') {
                    return validationError(err, res);
                }

                return internalError(err, res);
            }

            logger.info("Product created: " + product);
            return success(res, product);
        });
    }

    function update(req, res) {
        delete req.body._id; // see http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate. _id property does not allow for update operation
        var options = { new: true }; // for return new document
        return ProductModel.findByIdAndUpdate(req.params.id, req.body, options, function (err, product) {
            if (err) {
                if (err.name == 'ValidationError') return validationError(res);

                return internalError(err, res);
            }

            if (!product) return notFound(res);

            logger.info("product updated");
            return success(res, product);
        });
    }

    function remove(req, res) {
        return ProductModel.findByIdAndRemove(req.params.id, { }, function (err, product) {
            if (err) return internalError(err, res);

            if (!product) return notFound(res);

            logger.info("product removed");
            return success(res);
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