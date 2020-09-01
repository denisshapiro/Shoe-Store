var Brand = require('../models/brand');
var Shoe = require('../models/shoe');
var async = require('async');
//const validator = require('express-validator');

exports.index = function(req, res) {
    res.send('NOT IMPLEMENTED: Site Home Page');
};

//
exports.shoe_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Shoe list');
}

exports.shoe_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: shoe detail: ' + req.params.id);
}

exports.shoe_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: shoe create GET');
}

exports.shoe_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Shoe create POST');
};

exports.shoe_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: shoe delete GET');
};

exports.shoe_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Shoe delete POST');
};

exports.shoe_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Shoe update GET');
};

exports.shoe_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Shoe update POST');
};