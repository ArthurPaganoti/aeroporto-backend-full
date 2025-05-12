const Passenger = require('../models/Passenger');
const Flight = require('../models/Flight');

// criar passageiro
exports.create = async (req, res) => {
  try {
    const { nome, cpf, vooId } = req.body;
    const flight = await Flight.findById(vooId);
    if (!flight) return res.status(404).json({ error: 'Voo não encontrado' });
    if (flight.status !== 'embarque') return res.status(400).json({ error: 'Check-in só disponível em voo com status embarque' });
    const passenger = new Passenger({ nome, cpf, vooId });
    await passenger.save();
    res.status(201).json(passenger);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// listar todos
exports.list = async (req, res) => {
  const passengers = await Passenger.find().populate('vooId');
  res.json(passengers);
};

// obter por id
exports.get = async (req, res) => {
  const passenger = await Passenger.findById(req.params.id).populate('vooId');
  if (!passenger) return res.status(404).json({ error: 'Passageiro não encontrado' });
  res.json(passenger);
};

// atualizar passageiro (nome, cpf, voo)
exports.update = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.vooId) {
      const flight = await Flight.findById(updates.vooId);
      if (!flight) return res.status(404).json({ error: 'Voo não encontrado' });
    }
    const passenger = await Passenger.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.json(passenger);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// atualizar status de check-in
exports.checkIn = async (req, res) => {
  try {
    const passenger = await Passenger.findById(req.params.id);
    if (!passenger) return res.status(404).json({ error: 'Passageiro não encontrado' });
    const flight = await Flight.findById(passenger.vooId);
    if (flight.status !== 'embarque') return res.status(400).json({ error: 'Voo não está em embarque' });
    passenger.statusCheckIn = 'realizado';
    await passenger.save();
    res.json(passenger);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// deletar passageiro
exports.delete = async (req, res) => {
  await Passenger.findByIdAndDelete(req.params.id);
  res.json({ message: 'Passageiro excluído' });
};
