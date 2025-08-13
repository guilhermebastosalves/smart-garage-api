const express = require("express");
const router = express.Router();
const juridicaController = require("../controllers/juridicaController");

router.get('/', juridicaController.getAllJuridica);
router.post('/', juridicaController.createJuridica);

module.exports = router;