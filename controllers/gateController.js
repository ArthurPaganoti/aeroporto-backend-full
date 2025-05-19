const Gate = require('../models/Gate');

// criar portão
exports.create = async (req, res) => {
  try {
    // Verifica se já existe um portão com o mesmo código
    const exists = await Gate.findOne({ codigo: req.body.codigo });
    if (exists) {
      return res.status(400).json({ error: 'Já existe um portão com esse código.' });
    }
    const gate = new Gate(req.body);
    await gate.save();
    res.status(201).json(gate);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// listar todos
exports.list = async (req, res) => {
  const gates = await Gate.find();
  res.json(gates);
};

// obter por id
exports.get = async (req, res) => {
  const gate = await Gate.findById(req.params.id);
  if (!gate) return res.status(404).json({ error: 'Portão não encontrado' });
  res.json(gate);
};

// atualizar
exports.update = async (req, res) => {
  try {
    const gate = await Gate.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(gate);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// deletar
exports.delete = async (req, res) => {
  await Gate.findByIdAndDelete(req.params.id);
  res.json({ message: 'Portão excluído' });
};