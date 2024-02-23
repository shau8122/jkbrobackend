const mongoose = require('mongoose');

const furnitureSchema = new mongoose.Schema({
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

const Furniture = mongoose.model('Furniture', furnitureSchema);

module.exports = Furniture;
