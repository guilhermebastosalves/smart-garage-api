const express = require('express');
const router = express.Router();
const automovelController = require("../controllers/automovelController");

const upload = require("../config/multer");

router.get('/', automovelController.getAllAutomoveis);
router.post('/', upload.single("file"), automovelController.createAutomovel);
router.post('/verificar', automovelController.verificarDuplicidade);
router.get('/ativo', automovelController.getAllAutomoveisAtivos);
router.get('/:id', automovelController.getAutomovelById);
router.put('/:id', automovelController.updateAutomovel)

module.exports = router;