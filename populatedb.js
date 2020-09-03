#! /usr/bin/env node

// Get arguments passed on command line
var userArgs = process.argv.slice(2);

var async = require('async')
var Brand = require('./models/brand')
var Shoe = require('./models/shoe')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var shoes = []
var brands = []

function brandCreate(name, cb) {
  var brand = new Brand({ name: name });
       
  brand.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Brand: ' + brand);
    brands.push(brand)
    cb(null, brand);
  }   );
}

function shoeCreate(name, description, brand, price, stock, sizes, image, cb) {
  shoedetail = { 
    name: name,
    description: description,
    brand: brand,
    price: price,
    stock: stock,
    sizes: sizes, 
    image: image
  }
    
  var shoe = new Shoe(shoedetail);    
  shoe.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Shoe: ' + shoe);
    shoes.push(shoe)
    cb(null, shoe)
  }  );
}

function createBrands(cb) {
    async.series([
        function(callback) {
            brandCreate("Nike", callback);
        },
        function(callback) {
            brandCreate("Adidas", callback);
        },
        function(callback) {
            brandCreate("Asics", callback);
        },
        function(callback) {
            brandCreate("New Balance", callback);
        },
        function(callback) {
            brandCreate("Puma", callback);
        },
        ],
        cb);
}


function createShoes(cb) {
    async.parallel([
        function(callback) {
            shoeCreate('Nike Air Force 1 Low', 'Men\'s White shoe', brands[0], 245.00, 12, [8, 9, 11, 13], "images/AF1Low.webp", callback);
        },
        function(callback) {
            shoeCreate('adidas ULTRABOOST Parley', 'Men\'s Black shoe', brands[1], 95.00, 5, [9, 10, 11, 13], "images/ULTRABOOSTParley.webp", callback);
        },
        function(callback) {
            shoeCreate('ASICS Tiger GEL-DS Trainer OG', 'Men\'s Grey shoe', brands[2], 105.00, 0, [], "images/TigerGEL-DS.png", callback);
        },
        function(callback) {
            shoeCreate('New Balance OMN1S', 'Men\'s Orange shoe', brands[3], 200.00, 3, [4, 6, 11, 12], "images/OMN1S.png", callback);
        },
        function(callback) {
            shoeCreate('PUMA RS-X Trophy', 'Women\'s Black shoe', brands[4], 112.50, 10, [4, 5, 6, 7, 8, 9, 10], "images/PumaTrophy.webp", callback);
        },
        function(callback) {
            shoeCreate('Nike Air Max 270', 'Women\'s Black shoe', brands[0], 200.00, 4, [6, 7, 8], "images/Nike270.png", callback);
        },
        function(callback) {
            shoeCreate('adidas ULTRABOOST DNA', 'Women\'s Beige shoe', brands[1], 187.50, 0, [], "images/AdidasDNA.webp", callback);
        },
        ],
        cb);
}

async.series([
    createBrands,
    createShoes
],

function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('shoes: '+ shoes);
        
    }
    mongoose.connection.close();
});



