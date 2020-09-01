var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var ShoeSchema = new Schema(
    {
      name: {type: String, required: true, maxlength: 100},
      description: { type: String, required: true },
      brand: {type: Schema.Types.ObjectId, ref: 'Brand', required: true },
      price: {type: Number, required: true},
      stock: {type: Number, required: true},
      sizes: [{type: Number}],
      image: {type: String, required: true}
    }
  );

ShoeSchema
.virtual('url')
.get(function(){
  return '/shoe/' + this._id;
});

//Export model
module.exports = mongoose.model('Shoe', ShoeSchema);