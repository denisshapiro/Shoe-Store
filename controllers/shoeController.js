var Brand = require('../models/brand');
var Shoe = require('../models/shoe');
var async = require('async');
const validator = require('express-validator');

exports.index = function(req, res) {
    res.redirect('/shoes');
}

exports.shoe_list = function(req, res) {
    async.parallel({
        shoes: function(callback) {
            Shoe.find().populate('brand').exec(callback);
        },
        brands: function(callback) {
            Brand.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('shoe_list', { title: 'Shoes in Store', shoe_list: results.shoes, brand_list: results.brands });
    });
}

exports.shoe_detail = function(req, res, next) {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        var err = new Error('Invalid Shoe ID');
        err.status = 404;
        return next(err);
    }
    
    async.parallel({
        shoe: function(callback) {
            Shoe.findById(req.params.id).populate('brand').exec(callback);
        },
        brands: function(callback) {
            Brand.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (err) { return next(err); }
        if (!results.shoe) {
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        res.render('shoe_detail', { title: results.shoe.name, shoe: results.shoe, brand_list: results.brands } );
    });
}

exports.shoe_create_get = function(req, res) {
    Brand.find()
    .exec(function(err, brands){
        if (err) { return next(err); }
        res.render('shoe_form', { title: 'Create Shoe', brand_list: brands });
    });
}

exports.shoe_create_post = [
    validator.check('name', 'name must not be empty.').trim().isLength({ min: 1 }),
    validator.check('description', 'Description must not be empty.').trim().isLength({ min: 1 }),
    validator.check('price', 'Price must not be empty.').trim().trim().isNumeric(),

    validator.body('name').escape(),
    validator.body('description').escape(),

  (req, res, next) => {
        const errors = validator.validationResult(req);
        var file_url = `images/${req.file.filename}`
        var shoe = new Shoe(
          { name: req.body.name,
            description: req.body.description,
            brand: req.body.brand,
            price: req.body.price,
            stock: req.body.stock,
            sizes: req.body.sizes,
            image: file_url
           });
        if (!errors.isEmpty()) {
            Brand.find()
            .exec(function(err, brands){
                if (err) { return next(err); }
                /*
                for (let i = 0; i < brands.length; i++) {
                    if (shoe.brand.indexOf(brands[i]._id) > -1) {
                        brands[i].checked='true';
                        break;
                    }
                } */
                res.render('shoe_form', { title: 'Create Shoe', brand_list:brands, shoe:shoe, errors:errors.array() });
            });
            return;
        }
        else {
            shoe.save(function (err) {
                if (err) { return next(err); }
                res.redirect(shoe.url);
            });
        }
    }
];

exports.shoe_delete_get = function(req, res, next) {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        var err = new Error('Invalid Shoe ID');
        err.status = 404;
        return next(err);
    }
    Shoe.findById(req.params.id).exec(function(err, shoe){
        if (err) { return next(err); }
        if (shoe==null) {
            res.redirect('/shoes');
        }
        res.render('shoe_delete', { title: 'Delete Shoe', shoe: shoe } );
    });
};

exports.shoe_delete_post = function(req, res) {
    Shoe.findById(req.params.id).exec(function(err, shoe){
        if (err) { return next(err); }
        var brand = shoe.brand;
        var image = shoe.image;
        Shoe.findByIdAndRemove(shoe._id, function deleteShoe(err) {
            if (err) { return next(err); }
            res.redirect(`/brand/${brand}`)
        });
    });
};

exports.shoe_update_get = function(req, res) { 
    async.parallel({
        shoe: function(callback) {
            Shoe.findById(req.params.id).populate('brand').exec(callback);
        },
        brands: function(callback) {
            Brand.find(callback);
        },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.shoe ==null) {
                var err = new Error('Shoe not found');
                err.status = 404;
                return next(err);
            }
            for (var brandIDX = 0; brandIDX < results.genres.length; all_g_iter++) {
                for (var book_g_iter = 0; book_g_iter < results.book.genre.length; book_g_iter++) {
                    if (results.genres[all_g_iter]._id.toString()==results.book.genre[book_g_iter]._id.toString()) {
                        results.genres[all_g_iter].checked='true';
                    }
                }
            }   
            res.render('shoe_form', { title: 'Update Shoe', shoe: results.shoe, brand_list: results.brand });
        });
};

exports.shoe_update_post = [
   
    // Validate fields.
    validator.check('name', 'name must not be empty.').trim().isLength({ min: 1 }),
    validator.check('description', 'Description must not be empty.').trim().isLength({ min: 1 }),
    validator.check('image', 'Image must not be empty.').trim().isLength({ min: 1 }),  
    // Sanitize fields (using wildcard).
  //  validator.body('*').escape(),
    validator.body('name').escape(),
    validator.body('description').escape(),

  (req, res, next) => {
        const errors = validationResult(req);
        var shoe = new Shoe(
          { name: req.body.name,
            description: req.body.description,
            brand: req.body.brand,
            price: req.body.price,
            stock: req.body.stock,
            sizes: (typeof req.body.sizes ==='undefined') ? [] : req.body.sizes,
            image: req.body.image,
            _id: req.params.id
           });

        if (!errors.isEmpty()) {
            Brand.find()
            .exec(function(err, brands){
                if (err) { return next(err); }
                for (let i = 0; i < brands.length; i++) {
                    if (shoe.brand.indexOf(brands[i]._id) > -1) {
                        brands[i].checked='true';
                        break;
                    }
                }
                res.render('shoe_form', { title: 'Create Shoe', brand_list: brands, shoe:shoe, errors:errors.array() });
            });
            return;
        }
        else {
            shoe.save(function (err) {
                if (err) { return next(err); }
                   res.redirect(shoe.url);
                });
        }
    }
];

exports.shoe_buy = function(req, res, next) {
    Shoe.findById(req.params.id).exec(function(err, shoe){
        if (err) { return next(err); }
        var newStock = shoe.stock - req.body.purchaseAmount;
        var newShoe = new Shoe(
            { name: shoe.name,
              description: shoe.description,
              brand: shoe.brand,
              price: shoe.price,
              stock: newStock,
              sizes: shoe.sizes,
              image: shoe.image,
              _id: req.params.id
             });
        Shoe.findByIdAndUpdate(req.params.id, newShoe, function (err, theShoe) {
            if (err) { return next(err); }
            res.redirect(theShoe.url);
        });
    });
}
       