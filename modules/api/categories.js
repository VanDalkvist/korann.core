/*
 *  Categories API
 */

// #region dependents

// #region initialization

function init(app, models) {
    var CategoryModel = models.CategoryModel;

    app.get('/api/categories', getAll);
    app.post('/api/categories', create);
    app.get('/api/categories/:id', getById);
    app.put('/api/categories/:id', update);
    app.delete('/api/categories/:id', remove);

    function getAll(req, res) {
        return CategoryModel.find({ }, function (err, products) {
            if (err) return internalError(err, res);

            return success(res, products);
        });
    }

    function getById(req, res) {
        return CategoryModel.findById(req.params.id, function (err, category) {
            if (err) return internalError(err, res);

            return success(res, category);
        });
    }

    function create(req, res) {
        var newCategory = req.body;

        var category = new CategoryModel({
            name: newCategory.name,
            tags: newCategory.tags,
            description: newCategory.description,
            brand: newCategory.brand,
            images: newCategory.images
        });

        category.save(function categorySaveCallback(err, category) {
            if (!err) {
                logger.info("category created: " + category);
                return success(res, category);
            }

            if (err.name == 'ValidationError') {
                return validationError(err, res);
            }

            return internalError(err, res);
        });
    }

    function update(req, res) {
        return CategoryModel.findByIdAndUpdate(req.params.id, req.body, function (err, category) {
            // todo: untested
            if (err) {
                if (err.name == 'ValidationError') return validationError(res);

                return internalError(err, res);
            }

            if (!category) return notFound(res);

            logger.info("category updated");
            return success(res, category);
        });
    }

    function remove(req, res) {
        return CategoryModel.findAndRemove(req.params.id, function (err, category) {
            if (err) return internalError(err, res);

            if (!category) return notFound(res);

            logger.info("category removed");
            return success(res);
        });
    }
}

// #region private methods

// todo: move to custom errors
// todo: repeated code
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