const mongoose = require('mongoose');

const cartonsSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const Cartons = mongoose.model('Cartons', cartonsSchema);

module.exports = Cartons;
