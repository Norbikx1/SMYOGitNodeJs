const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  colour: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
