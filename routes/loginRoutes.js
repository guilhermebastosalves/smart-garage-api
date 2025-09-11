const express = require('express');
const router = express.Router();
const loginController = require("../controllers/loginController");

router.post('/', loginController.login);

// Rota para o usuário solicitar a redefinição de senha
router.post('/esqueci-senha', loginController.solicitarResetSenha);

// Rota para o usuário enviar a nova senha com o token
router.post('/resetar-senha/:token', loginController.resetarSenha);

module.exports = router;