const express = require('express');
const router = express.Router();
const fc = require('../controllers/flightController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

// Rotas públicas
router.get('/', fc.list); // Listar todos os voos (público)
router.get('/:id', fc.get); // Obter um voo específico (público)

// Rotas protegidas
router.post('/', authMiddleware, fc.create); // Apenas usuários autenticados
router.put('/:id', authMiddleware, adminMiddleware, fc.update); // Apenas administradores
router.patch('/:id/status', authMiddleware, adminMiddleware, fc.updateStatus); // Atualizar status do voo
router.delete('/:id', authMiddleware, adminMiddleware, fc.delete); // Apenas administradores

module.exports = router;