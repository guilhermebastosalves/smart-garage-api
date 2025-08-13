const express = require('express');
const router = express.Router();
const trocaController = require('../controllers/trocaController');

router.get('/', trocaController.getAllTrocas);
router.post('/', trocaController.createTroca);
router.get('/:id', trocaController.getTrocaById);

module.exports = router;