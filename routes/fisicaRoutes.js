const express = require("express");
const router = express.Router();
const fisicaController = require("../controllers/fisicaController");

router.get('/', fisicaController.getAllFisica);
router.post('/', fisicaController.createFisica);

module.exports = router;