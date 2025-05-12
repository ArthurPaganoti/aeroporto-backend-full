const Flight = require('../models/Flight');
const Gate = require('../models/Gate');

// criar voo
exports.create = async (req, res) => {
  try {
    const flight = new Flight(req.body);
    await flight.save();
    res.status(201).json(flight);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// listar todos
exports.list = async (req, res) => {
  const flights = await Flight.find().populate('gateId');
  res.json(flights);
};

// obter por id
exports.get = async (req, res) => {
  const flight = await Flight.findById(req.params.id).populate('gateId');
  if (!flight) return res.status(404).json({ error: 'Voo não encontrado' });
  res.json(flight);
};

// atualizar dados do voo
exports.update = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(flight);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// atualizar status do voo
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).json({ error: 'Voo não encontrado' });
    flight.status = status;
    await flight.save();
    res.json(flight);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// atribuir portão
exports.assignGate = async (req, res) => {
  try {
    const { gateId } = req.body;
    const gate = await Gate.findById(gateId);
    if (!gate || !gate.disponivel) return res.status(400).json({ error: 'Portão indisponível' });
    gate.disponivel = false;
    await gate.save();
    const flight = await Flight.findById(req.params.id);
    flight.gateId = gateId;
    await flight.save();
    res.json(await flight.populate('gateId'));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// deletar voo
exports.delete = async (req, res) => {
  await Flight.findByIdAndDelete(req.params.id);
  res.json({ message: 'Voo excluído' });
};
