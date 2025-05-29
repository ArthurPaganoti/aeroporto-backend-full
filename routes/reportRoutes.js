const express = require('express');
const router = express.Router();
const Flight = require('../models/Flight');
const Passenger = require('../models/Passenger');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

// Rota protegida para gerar relatório diário (apenas administradores)
router.get('/daily', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Define o intervalo de tempo para o dia atual
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // Busca todos os voos programados para o dia atual
    const flights = await Flight.find({ dataHoraPartida: { $gte: start, $lte: end } }).populate('gateId');

    if (!flights || flights.length === 0) {
      return res.status(404).json({ error: 'Nenhum voo programado para o dia atual.' });
    }

    // Gera o relatório
    const report = await Promise.all(
      flights.map(async (flight) => {
        // Busca os passageiros do voo
        const passengers = await Passenger.find({ vooId: flight._id });

        return {
          numeroVoo: flight.numeroVoo,
          origem: flight.origem,
          destino: flight.destino,
          dataHoraPartida: flight.dataHoraPartida,
          statusVoo: flight.status,
          portao: flight.gateId ? flight.gateId.nome : 'Não atribuído',
          passageiros: passengers.map((p) => ({
            nome: p.nome,
            statusCheckIn: p.statusCheckIn ? 'Check-in realizado' : 'Check-in pendente',
          })),
        };
      })
    );

    res.json(report);
  } catch (err) {
    console.error('Erro ao gerar o relatório:', err.message);
    res.status(500).json({ error: 'Erro ao gerar o relatório.' });
  }
});

module.exports = router;