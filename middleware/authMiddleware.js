const jwt = require('jsonwebtoken');

// Middleware para verificar a validade do token JWT
const verifyToken = (req, res, next) => {

    // Pega o token do header da requisição (formato: "Bearer TOKEN")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // Nenhum token foi fornecido
        return res.status(401).send({ mensagem: "Acesso negado. Nenhum token fornecido." });
    }

    try {
        // Verifica se o token é válido usando o mesmo segredo do login
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seu_segredo_super_secreto');

        req.user = decoded;

        next();
    } catch (error) {
        console.error('Erro de verificação do token:', error.name, error.message);
        return res.status(400).send({ mensagem: "Token inválido." });
    }
};

const isGerente = (req, res, next) => {
    if (req.user && req.user.role === 'gerente') {
        next();
    } else {
        return res.status(403).send({ mensagem: "Acesso negado. Rota exclusiva para gerentes." });
    }
};

module.exports = {
    verifyToken,
    isGerente
};