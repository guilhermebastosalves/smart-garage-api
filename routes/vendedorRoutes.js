const express = require("express");
const router = express.Router();
const vendedorController = require("../controllers/vendedorController");
const authMiddleware = require('../middleware/authMiddleware'); // Middleware para verificar o token e o cargo

router.get("/:funcionarioId", vendedorController.findByFuncionarioid);

router.post('/', authMiddleware.verifyToken, authMiddleware.isGerente, vendedorController.create);

// Rota para listar todos os vendedores (apenas gerentes)
router.get('/', authMiddleware.verifyToken, authMiddleware.isGerente, vendedorController.getAll);

// Rota para ATUALIZAR O STATUS (ativar/inativar) de um vendedor
router.patch('/:id/status', authMiddleware.verifyToken, authMiddleware.isGerente, vendedorController.updateStatus);

// Opcional: Rota para atualizar os dados de um vendedor (nome, usuário, etc.)
// router.put('/:id', authMiddleware.verifyToken, authMiddleware.isGerente, vendedorController.update);


module.exports = router;