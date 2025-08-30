const express = require('express');
const router = express.Router();
const manutencaoController = require('../controllers/manutencaoController');

router.get('/', manutencaoController.getAllManutencoes);
router.get("/dataenvio", manutencaoController.getAllManutencoesOrderByData);
router.get('/detalhes/:id', manutencaoController.getManutencaoDetalhesById);
router.get('/:id', manutencaoController.getManutencaoById);
router.post('/', manutencaoController.createManutencao);
router.put('/:id', manutencaoController.updateManutencao);
router.delete('/:id', manutencaoController.deleteManutencao);

module.exports = router;