/*
 *  Categories API
 */

// #region dependents

var logger = require('log').getLogger(module);
var errors = require('errors');

// #region initialization

function init(app, models) {
    var CategoryModel = models.CategoryModel;

    app.get('/api/categories', getAll);
    app.post('/api/categories', create);
    app.get('/api/categories/:id', getById);
    app.put('/api/categories/:id', update);
    app.delete('/api/categories/:id', remove);

    function getAll(req, res, next) {
        return CategoryModel.find({}, function (err, categories) {
            if (err) return next(new errors.HttpError(500, err.message));

            return success(res, categories);
        });
    }

    function getById(req, res, next) {
        return CategoryModel.findById(req.params.id, function (err, category) {
            if (err) return next(new errors.HttpError(500, err.message));

            return success(res, category);
        });
    }

    function create(req, res, next) {
        var newCategory = req.body;

        var category = new CategoryModel({
            name: newCategory.name,
            description: newCategory.description,
            images: newCategory.images
        });

        category.save(function categorySaveCallback(err, category) {
            if (!err) {
                logger.info("category created: " + category);
                return success(res, category);
            }

            if (err.name === 'ValidationError') {
                return next(new errors.HttpError(400, "Validation error: " + err.message));
            }

            return next(new errors.HttpError(500, err.message));
        });
    }

    function update(req, res, next) {
        delete req.body._id;            // see http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate. _id property does not allow for update operation
        var options = {new: true};    // for return new document
        return CategoryModel.findByIdAndUpdate(req.params.id, req.body, options, function (err, category) {
            if (err) {
                if (err.name == 'ValidationError') {
                    return next(new errors.HttpError(400, "Validation error: " + err.message));
                }

                return next(new errors.HttpError(500, err.message));
            }

            if (!category) return next(new errors.NotFoundError());

            logger.info("category updated");
            return success(res, category);
        });
    }

    function remove(req, res, next) {
        return CategoryModel.findByIdAndRemove(req.params.id, {}, function (err, category) {
            if (err) return next(new errors.HttpError(500, err.message));

            if (!category) return next(new errors.NotFoundError());

            logger.info("category removed");
            return success(res);
        });
    }
}

// #region private methods

function success(res, data) {
    return res.status(200).send({data: data});
}

// #region exports

exports.init = init;