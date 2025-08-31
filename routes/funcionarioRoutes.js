// src/routes/login.routes.js

const express = require('express');
const router = express.Router();
const funcionarioController = require("../controllers/funcionarioController");

router.post('/', funcionarioController.createFuncionario);
router.get('/', funcionarioController.getAllFuncionarios);

module.exports = router;