const express = require('express');
const router = express.Router();
const pc = require('../controllers/passengerController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

// Rotas públicas
router.get('/', pc.list); // Listar todos os passageiros (público)
router.get('/:id', pc.get); // Obter um passageiro específico (público)

// Rotas protegidas
router.post('/', authMiddleware, pc.create); // Apenas usuários autenticados
router.put('/:id', authMiddleware, adminMiddleware, pc.update); // Apenas administradores
router.patch('/:id/checkin', authMiddleware, pc.checkIn); // Apenas usuários autenticados
router.delete('/:id', authMiddleware, adminMiddleware, pc.delete); // Apenas administradores

module.exports = router;