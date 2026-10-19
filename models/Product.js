const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  pid: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
    validate: Number.isInteger
  },
  pname: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    validate: Number.isInteger
  }
});

module.exports = mongoose.model('Product', productSchema);