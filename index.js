const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();

// IMPORTAR MODELOS DO BANCO DE DADOS
const DB = require('./models/index');
const { sequelize } = require('./db');

sequelize.sync({ alter: true }).then(async () => {
    console.log('Sincronizado!');
});


// Habilita CORS para todas as origens
const cors = require('cors');
app.use(cors());


// BODYPARSER
app.use(express.json());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// ROTAS - AUTOMOVEL
const automovelRoutes = require("./routes/automovelRoutes");

// ROTAS - MARCA
const marcaRoutes = require("./routes/marcaRoutes");

// ROTAS - MODELO
const modeloRoutes = require("./routes/modeloRoutes");

// ROTAS - CLIENTE
const clienteRoutes = require("./routes/clienteRoutes");

// ROTAS - FISICA
const fisicaRoutes = require("./routes/fisicaRoutes");

// ROTAS - JURIDICA
const juridicaRoutes = require("./routes/juridicaRoutes");

// ROTAS - COMPRA
const compraRoutes = require("./routes/compraRoutes");

// ROTAS - CONSIGNACAO
const consignacaoRoutes = require("./routes/consignacaoRoutes");

// ROTAS - ENDERECO
const enderecoRoutes = require("./routes/enderecoRoutes");

// ROTAS - CIDADE
const cidadeRoutes = require("./routes/cidadeRoutes");

// ROTAS - ESTADO
const estadoRoutes = require("./routes/estadoRoutes");

// ROTAS - TROCA
const trocaRoutes = require("./routes/trocaRoutes");

// ROTAS - VENDA
const vendaRoutes = require("./routes/vendaRoutes");

// ROTAS - GASTO
const gastoRoutes = require("./routes/gastoRoutes");

// ROTAS - MANUTENCAO
const manutencaoRoutes = require("./routes/manutencaoRoutes");

// ROTAS - LOGIN
const loginRoutes = require('./routes/loginRoutes');

// ROTAS - FUNCIONARIO
const funcionarioRoutes = require('./routes/funcionarioRoutes');

// ROTAS - VENDEDOR
const vendedorRoutes = require('./routes/vendedorRoutes');

// ROTAS - RELATOIRO
const relatorioRoutes = require('./routes/relatorioRoutes');


app.use('/api/automovel', automovelRoutes);
app.use('/api/marca', marcaRoutes);
app.use('/api/modelo', modeloRoutes);
app.use('/api/cliente', clienteRoutes);
app.use('/api/fisica', fisicaRoutes);
app.use('/api/juridica', juridicaRoutes);
app.use('/api/compra', compraRoutes);
app.use('/api/consignacao', consignacaoRoutes);
app.use('/api/endereco', enderecoRoutes);
app.use('/api/cidade', cidadeRoutes);
app.use('/api/estado', estadoRoutes);
app.use('/api/troca', trocaRoutes);
app.use('/api/venda', vendaRoutes);
app.use('/api/gasto', gastoRoutes);
app.use('/api/manutencao', manutencaoRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/funcionario', funcionarioRoutes);
app.use('/api/vendedor', vendedorRoutes);
app.use('/api/relatorio', relatorioRoutes);


const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
})