const express = require('express');
const router = express.Router();
const fuelPriceController = require('../controllers/fuel-price.controller');

router.get('/fuel-metadata', fuelPriceController.getAllFuelMetadata);
router.get('/fuel-price', fuelPriceController.getFuelPrice);
router.post('/update', fuelPriceController.updateFuelPrice);


module.exports = router;
