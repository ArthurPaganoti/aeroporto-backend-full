// filepath: c:\Users\pagan\OneDrive\Área de Trabalho\aeroporto-backend-full\middlewares\authMiddleware.js
const jwt = require('jsonwebtoken');

// Middleware para autenticação
function authMiddleware(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Token não fornecido' });

    jwt.verify(token, 'secreta', (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido ou expirado' });
        req.user = user;
        next();
    });
}

// Middleware para verificar se o usuário é admin
function adminMiddleware(req, res, next) {
    if (req.user.cargo !== 'admin') {
        return res.status(403).json({ message: 'Acesso restrito a administradores' });
    }
    next();
}

module.exports = { authMiddleware, adminMiddleware };