const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.get('/', clienteController.getAllClientes);
router.post('/verificar', clienteController.verificarDuplicidade);
router.post('/', clienteController.createCliente);
router.get('/:id', clienteController.getClienteById);


module.exports = router;