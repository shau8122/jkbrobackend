const mongoose = require('mongoose');

const appliancesSchema = new mongoose.Schema({
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

const Appliances = mongoose.model('Appliances', appliancesSchema);

module.exports = Appliances;
