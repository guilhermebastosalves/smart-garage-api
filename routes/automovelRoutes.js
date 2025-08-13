const express = require('express');
const router = express.Router();
const automovelController = require("../controllers/automovelController");

router.get('/', automovelController.getAllAutomoveis);
router.post('/', automovelController.createAutomovel);
router.post('/verificar', automovelController.verificarDuplicidade);
router.get('/:id', automovelController.getAutomovelById);
router.put('/:id', automovelController.updateAutomovel)

module.exports = router;