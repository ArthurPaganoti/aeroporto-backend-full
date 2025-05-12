const express = require('express');
const router = express.Router();
const Flight = require('../models/Flight');
const Passenger = require('../models/Passenger');

router.get('/daily', async (req, res) => {
  const start = new Date();
  start.setHours(0,0,0,0);
  const end = new Date();
  end.setHours(23,59,59,999);

  const flights = await Flight.find({ dataHoraPartida: { $gte: start, $lte: end } }).populate('gateId');

  const report = await Promise.all(flights.map(async flight => {
    const passengers = await Passenger.find({ vooId: flight._id });
    return {
      flight,
      gate: flight.gateId,
      passengers: passengers.map(p => ({ nome: p.nome, statusCheckIn: p.statusCheckIn }))
    };
  }));

  res.json(report);
});

module.exports = router;
