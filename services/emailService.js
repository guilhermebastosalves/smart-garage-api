const nodemailer = require('nodemailer');

// Configure o "transportador" de e-mail com as credenciais do seu serviço
// IMPORTANTE: Use variáveis de ambiente (.env) para essas credenciais, nunca as coloque diretamente no código!
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // Ex: "smtp.gmail.com"
    port: process.env.EMAIL_PORT, // Ex: 587
    secure: false, // true para porta 465, false para outras
    auth: {
        user: process.env.EMAIL_USER, // Seu e-mail
        pass: process.env.EMAIL_PASS, // Sua senha ou senha de aplicativo
    },
});

const enviarEmailResetSenha = async (destinatario, token) => {
    const resetUrl = `http://localhost:5173/resetar-senha/${token}`;

    const mailOptions = {
        from: '"Smart Garage" <seu-email@exemplo.com>',
        to: destinatario,
        subject: 'Redefinição de Senha - Smart Garage',
        html: `
            <p>Você solicitou a redefinição da sua senha.</p>
            <p>Clique no link a seguir para criar uma nova senha:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>Se você não solicitou isso, por favor, ignore este e-mail.</p>
        `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { enviarEmailResetSenha };