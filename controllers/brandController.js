var Brand = require('../models/brand');
var Shoe = require('../models/shoe');
var async = require('async');
const validator = require('express-validator');

exports.brand_detail = function(req, res, next) {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        var err = new Error('Invalid Brand ID');
        err.status = 404;
        return next(err);
    }   
    async.parallel({
        brand: function(callback) {
            Brand.findById(req.params.id)
              .exec(callback);
        },

        shoes: function(callback) { 
            Shoe.find({ 'brand': req.params.id }).exec(callback);
        },

        allbrands: function(callback) {
            Brand.find().exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.brand==null) { 
            var err = new Error('Brand not found');
            err.status = 404;
            return next(err);
        }
        res.render('brand_detail', { title: 'Shoes by ' + results.brand.name, brand: results.brand, brand_shoes: results.shoes, brand_list: results.allbrands } );
    });
}

exports.brand_create_get = function(req, res) {
    Brand.find().exec(function(err, brands){
        if (err) { return next(err); }
        res.render('brand_form', { title: 'Create Brand', brand_list: brands });
    });
}

exports.brand_create_post = [
    validator.check('name', 'Brand name required').trim().isLength({ min: 1 }),
    validator.body('name').escape(),

    (req, res, next) => {
      const errors = validator.validationResult(req);
  
      var brand = new Brand(
        { name: req.body.name }
      );
  
      if (!errors.isEmpty()) {
        Brand.find().exec(function(err, brands){
            if (err) { return next(err); }
            res.render('brand_form', { title: 'Create Brand', brand: brand, errors: errors.array(), brand_list: brands});
            return;
        });
      }
      else {
        Brand.findOne({'name': req.body.name })
          .exec( function(err, found_brand) {
             if (err) { return next(err); }
             if (found_brand) {
               res.redirect(found_brand.url);
             }
             else {
               brand.save(function (err) {
                 if (err) { return next(err); }
                 res.redirect(brand.url);
               });
             }
           });
      }
    }
  ];

exports.brand_delete_post = function(req, res) {
    async.parallel({
        brand: function(callback) {
          Brand.findById(req.params.id).exec(callback)
        },
        brand_shoes: function(callback) {
          Shoe.find({ 'brand': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.brand_shoes.length > 0) {
            res.redirect(results.brand.url);
            return;
        }
        else {
            Brand.findByIdAndRemove(req.params.id, function deleteBrand(err) {
                if (err) { return next(err); }
                res.redirect('/shoes')
            })
        }
    });
};
