const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// IMPORTAR MODELOS DO BANCO DE DADOS
const DB = require('./models/index');
const { sequelize } = require('./db');

sequelize.sync({ alter: true }).then(async () => {
    console.log('Sincronizado!');

    // const newMarca = await DB.Marca.create({
    //     nome: "Volkswagen"
    // });

    // const newAutomovel = await DB.Automovel.create({
    //     ativo: true,
    //     cor: "Marrom",
    //     combustivel: "Etanol",
    //     km: "80000",
    //     origem: "Compra",
    //     placa: "ACK1618",
    //     renavam: "11111111111",
    //     valor: 50000,
    //     marcaId: newMarca.id,
    //     ano_fabricacao: 1991,
    //     ano_modelo: 1991
    // });

    // const newModelo = await DB.Modelo.create({
    //     nome: "Gol",
    //     marcaId: newMarca.id
    // });


});


// Habilita CORS para todas as origens
const cors = require('cors');
app.use(cors());

// Ou especifique só para seu front:
// app.use(cors({ origin: 'http://localhost:5173' }));


// BODYPARSER
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

app.use(express.json());
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


const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
})