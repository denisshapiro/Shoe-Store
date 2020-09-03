var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var BrandSchema = new Schema(
    {
      name: {type: String, required: true, minlength: 1,  maxlength: 100}
    }
  );

BrandSchema
.virtual('url')
.get(function(){
  return '/brand/' + this._id;
});

//Export model
module.exports = mongoose.model('Brand', BrandSchema);