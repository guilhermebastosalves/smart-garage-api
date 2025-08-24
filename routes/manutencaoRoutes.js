const express = require('express');
const router = express.Router();
const manutencaoController = require('../controllers/manutencaoController');

router.get('/', manutencaoController.getAllManutencoes);
router.get('/:id', manutencaoController.getManutencaoById);
router.post('/', manutencaoController.createManutencao);
router.put('/', manutencaoController.updateManutencao);

module.exports = router;