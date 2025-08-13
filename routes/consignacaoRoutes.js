const express = require("express");
const router = express.Router();
const consignacaoController = require("../controllers/consignacaoController");

router.get("/", consignacaoController.getAllConsignacoes);
router.post("/", consignacaoController.createConsignacao);
router.get("/datainicio", consignacaoController.getAllConsignacoesOrderByData);
router.get('/ativo', consignacaoController.getAllConsignacoesAtivas);
router.get('/:id', consignacaoController.getConsignacaoById);
router.put('/:id', consignacaoController.updateConsignacao);


module.exports = router;