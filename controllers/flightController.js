const Flight = require('../models/Flight');
const Gate = require('../models/Gate');
const Passenger = require('../models/Passenger');

exports.create = async (req, res) => {
  try {
    const flight = new Flight(req.body);
    await flight.save();
    res.status(201).json(flight);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Já existe um voo com esse número.' });
    }
    res.status(400).json({ error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const flights = await Flight.find()
      .populate('gateId')
      .sort({ dataHoraPartida: 1 });
    res.json(flights);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar voos' });
  }
};

exports.get = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id).populate('gateId');
    if (!flight) {
      return res.status(404).json({ error: 'Voo não encontrado' });
    }
    res.json(flight);
  } catch (err) {
    res.status(400).json({ error: 'ID de voo inválido' });
  }
};

exports.update = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ error: 'Voo não encontrado' });
    }

    // Remove campos que não devem ser atualizados diretamente
    delete req.body.status;
    delete req.body.gateId;

    Object.assign(flight, req.body);
    await flight.save();

    res.json(await flight.populate('gateId'));
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Número de voo já existe' });
    }
    res.status(400).json({ error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const flight = await Flight.findById(req.params.id);

    if (!flight) {
      return res.status(404).json({ error: 'Voo não encontrado' });
    }

    // Validações de mudança de status
    if (status === 'embarque') {
      if (!flight.gateId) {
        return res.status(400).json({ error: 'Voo precisa ter um portão atribuído para iniciar embarque' });
      }
      const passageiros = await Passenger.find({ vooId: flight._id });
      if (passageiros.length === 0) {
        return res.status(400).json({ error: 'Voo precisa ter passageiros para iniciar embarque' });
      }
    }

    flight.status = status;
    await flight.save();
    res.json(await flight.populate('gateId'));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.assignGate = async (req, res) => {
  try {
    const { gateId } = req.body;
    const flight = await Flight.findById(req.params.id);
    const gate = await Gate.findById(gateId);

    // Validações
    if (!flight) {
      return res.status(404).json({ error: 'Voo não encontrado' });
    }
    if (!gate) {
      return res.status(404).json({ error: 'Portão não encontrado' });
    }
    if (!gate.disponivel) {
      return res.status(400).json({ error: 'Portão indisponível' });
    }
    if (flight.status === 'concluído') {
      return res.status(400).json({ error: 'Não é possível atribuir portão a um voo concluído' });
    }

    // Libera portão anterior se existir
    if (flight.gateId) {
      await Gate.findByIdAndUpdate(flight.gateId, { disponivel: true });
    }

    // Atribui novo portão
    flight.gateId = gateId;
    await flight.save();

    res.json(await flight.populate('gateId'));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ error: 'Voo não encontrado' });
    }

    // Verifica se há passageiros
    const passageirosCount = await Passenger.countDocuments({ vooId: flight._id });
    if (passageirosCount > 0) {
      return res.status(400).json({ error: 'Não é possível excluir voo com passageiros' });
    }

    // Remove o voo e libera o portão
    await flight.remove();
    res.json({ message: 'Voo excluído com sucesso' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};