const express = require('express');
const router = express.Router();
const trocaController = require('../controllers/trocaController');

router.get('/', trocaController.getAllTrocas);
router.post('/', trocaController.createTroca);
router.get('/detalhes/:id', trocaController.getTrocaDetalhesById);
router.get('/:id', trocaController.getTrocaById);
router.put('/:id', trocaController.updateTroca);

module.exports = router;