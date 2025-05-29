const express = require('express');
const router = express.Router();
const gc = require('../controllers/gateController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

// Rotas públicas
router.get('/', gc.list); // Listar todos os portões (público)
router.get('/:id', gc.get); // Obter um portão específico (público)

// Rotas protegidas
router.post('/', authMiddleware, gc.create); // Apenas usuários autenticados
router.put('/:id', authMiddleware, adminMiddleware, gc.update); // Apenas administradores
router.delete('/:id', authMiddleware, adminMiddleware, gc.delete); // Apenas administradores

module.exports = router;