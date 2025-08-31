const express = require('express');
const router = express.Router();
const automovelController = require("../controllers/automovelController");

const upload = require("../config/multer");

router.get('/', automovelController.getAllAutomoveis);
router.post('/', upload.single("file"), automovelController.createAutomovel);
router.post('/verificar', automovelController.verificarDuplicidade);
router.get('/ativo', automovelController.getAllAutomoveisAtivos);
router.get('/inativo', automovelController.getAllAutomoveisInativos);
router.get('/renavam/:renavam', automovelController.getAutomovelByRenavam);
router.get('/detalhes/:id', automovelController.getAutomovelDetalhesById);
router.get('/:id', automovelController.getAutomovelById);
router.put('/:id', upload.single("file"), automovelController.updateAutomovel)

module.exports = router;