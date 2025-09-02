const express = require("express");
const router = express.Router();
const vendedorController = require("../controllers/vendedorController");

router.get("/:funcionarioId", vendedorController.findByFuncionarioid);


module.exports = router;