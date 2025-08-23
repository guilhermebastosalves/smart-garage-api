const express = require("express");
const router = express.Router();
const vendaController = require("../controllers/vendaController");

router.get("/", vendaController.getAllVendas);
router.get("/data", vendaController.getAllVendasOrderByData);
router.post("/", vendaController.createVenda);

module.exports = router;