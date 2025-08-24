const express = require('express');
const router = express.Router();
const gastoController = require('../controllers/gastoController');

router.get('/', gastoController.getAllGastos);
router.get('/:id', gastoController.getGastoById);
router.post('/', gastoController.createGasto);
router.put('/', gastoController.updateGasto);

module.exports = router;