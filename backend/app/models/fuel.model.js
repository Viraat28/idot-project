const mongoose = require('mongoose');

const FuelPriceSchema = new mongoose.Schema({
  County: String,
  Quarter: String,
  'Fuel Type': String,
  'Fuel Price': Number
}, { collection: 'csv fuel data' }); // match your MongoDB collection name exactly

module.exports = mongoose.model('FuelPrice', FuelPriceSchema);
