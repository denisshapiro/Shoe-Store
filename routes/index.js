var express = require('express');
var router = express.Router();
var multer  = require('multer')
var aws = require('aws-sdk')
const multerS3 = require('multer-s3');

aws.config.update({
  accessKeyId:  process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: 'us-east-2'
});

const s3 = new aws.S3();

const storage = multer.diskStorage({
  destination: "./public/images",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

//var upload = multer({ storage: s3Storage, limits: { fileSize: 10000000 } })

const upload = multer({
  storage: multerS3({
      s3: s3,
      acl: 'public-read',
      bucket: 'shoestoreinventory',
      key: function (req, file, cb) {
          console.log(file);
          cb(null, file.originalname); //use Date.now() for unique file keys
      }
  })
});

// Require controller modules.
var shoeController = require('../controllers/shoeController');
var brandController = require('../controllers/brandController');

// GET home page.
router.get('/', shoeController.index);

router.get('/shoe/create', shoeController.shoe_create_get);

// POST request for creating Book.
router.post('/shoe/create', upload.single('uploaded_image'), shoeController.shoe_create_post);

// POST request to delete Book.
router.post('/shoe/:id/delete', shoeController.shoe_delete_post);

// POST request to update Book.
router.post('/shoe/:id/update', shoeController.shoe_update_post);

// GET request for one Book.
router.get('/shoe/:id', shoeController.shoe_detail);

// GET request for list of all Book items.
router.get('/shoes', shoeController.shoe_list);

router.post('/shoe/:id/', shoeController.shoe_buy);

/// BRAND ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/brand/create', brandController.brand_create_get);

//POST request for creating Genre.
router.post('/brand/create', brandController.brand_create_post);

// POST request to delete Genre.
router.post('/brand/:id/delete', brandController.brand_delete_post);

// GET request for one Genre.
router.get('/brand/:id', brandController.brand_detail);

module.exports = router;
