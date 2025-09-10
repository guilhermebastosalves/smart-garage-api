const jwt = require('jsonwebtoken');

// 1. Middleware para verificar a validade do token JWT
const verifyToken = (req, res, next) => {
    // Pega o token do header da requisição (formato: "Bearer TOKEN")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // 401 Unauthorized: Nenhum token foi fornecido
        return res.status(401).send({ mensagem: "Acesso negado. Nenhum token fornecido." });
    }

    try {
        // Verifica se o token é válido usando o mesmo segredo do login
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seu_segredo_super_secreto');

        // Adiciona os dados do usuário decodificados (id, nome, role) ao objeto 'req'
        // para que as próximas funções (como isGerente) possam usá-los
        req.user = decoded;

        // Passa para a próxima função na cadeia (seja outro middleware ou o controller)
        next();
    } catch (error) {
        // 400 Bad Request: O token fornecido é inválido (expirado, malformado, etc.)
        return res.status(400).send({ mensagem: "Token inválido." });
    }
};

// 2. Middleware para verificar se o usuário é um Gerente
const isGerente = (req, res, next) => {
    // Esta função RODA DEPOIS de 'verifyToken', então 'req.user' já deve existir
    if (req.user && req.user.role === 'gerente') {
        // Se o cargo for 'gerente', permite que a requisição continue
        next();
    } else {
        // 403 Forbidden: O usuário está autenticado, mas não tem permissão para acessar esta rota
        return res.status(403).send({ mensagem: "Acesso negado. Rota exclusiva para gerentes." });
    }
};

module.exports = {
    verifyToken,
    isGerente
};