const Flight = require('../models/Flight');
const Gate = require('../models/Gate');

class FlightController {
  // Criar voo
  static async create(req, res) {
    try {
      const gate = await Gate.findById(req.body.gateId);
      if (!gate) {
        return res.status(400).json({ error: 'Portão não encontrado.' });
      }
      if (!gate.disponivel) {
        return res.status(400).json({ error: 'Portão já está ocupado.' });
      }

      const flight = new Flight(req.body);
      await flight.save();

      gate.disponivel = false;
      await gate.save();

      res.status(201).json(flight);
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Já existe um voo com esse número.' });
      }
      res.status(400).json({ error: err.message });
    }
  }

  // Listar todos os voos
  static async list(req, res) {
    try {
      const flights = await Flight.find().populate('gateId');
      res.json(flights);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Obter voo por ID
  static async get(req, res) {
    try {
      const flight = await Flight.findById(req.params.id).populate('gateId');
      if (!flight) return res.status(404).json({ error: 'Voo não encontrado' });
      res.json(flight);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Atualizar voo (PUT)
  static async update(req, res) {
    try {
      if (req.body.gateId) {
        const gate = await Gate.findById(req.body.gateId);
        if (!gate) {
          return res.status(400).json({ error: 'Portão não encontrado.' });
        }
        if (!gate.disponivel) {
          return res.status(400).json({ error: 'Portão já está ocupado.' });
        }
      }
      const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      res.json(flight);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Atualizar parcialmente voo (PATCH)
  static async partialUpdate(req, res) {
    try {
      const flight = await Flight.findById(req.params.id);
      if (!flight) return res.status(404).json({ error: 'Voo não encontrado' });

      // Atualiza apenas os campos fornecidos no corpo da requisição
      Object.assign(flight, req.body);

      // Se o portão está sendo atualizado, valide e ajuste a disponibilidade
      if (req.body.gateId) {
        const newGate = await Gate.findById(req.body.gateId);
        if (!newGate) {
          return res.status(400).json({ error: 'Portão não encontrado.' });
        }
        if (!newGate.disponivel) {
          return res.status(400).json({ error: 'Portão já está ocupado.' });
        }

        // Libera o portão anterior, se houver
        if (flight.gateId && String(flight.gateId) !== String(newGate._id)) {
          await Gate.findByIdAndUpdate(flight.gateId, { disponivel: true });
        }

        // Marca o novo portão como indisponível
        newGate.disponivel = false;
        await newGate.save();
        flight.gateId = newGate._id;
      }

      await flight.save();
      res.json(flight);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Atualizar status do voo (PATCH /:id/status)
  static async updateStatus(req, res) {
    try {
      const flight = await Flight.findById(req.params.id);
      if (!flight) return res.status(404).json({ error: 'Voo não encontrado' });

      if (req.body.status === 'concluido' && flight.gateId) {
        const gate = await Gate.findById(flight.gateId);
        if (gate) {
          gate.disponivel = true;
          await gate.save();
        }
      }

      flight.status = req.body.status;
      await flight.save();
      res.json(flight);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Atribuir portão ao voo (PATCH /:id/assign-gate)
  static async assignGate(req, res) {
    try {
      const flight = await Flight.findById(req.params.id);
      if (!flight) return res.status(404).json({ error: 'Voo não encontrado' });

      const gate = await Gate.findById(req.body.gateId);
      if (!gate) return res.status(400).json({ error: 'Portão não encontrado.' });
      if (!gate.disponivel) return res.status(400).json({ error: 'Portão já está ocupado.' });

      if (flight.gateId && String(flight.gateId) !== String(gate._id)) {
        await Gate.findByIdAndUpdate(flight.gateId, { disponivel: true });
      }

      flight.gateId = gate._id;
      await flight.save();
      gate.disponivel = false;
      await gate.save();

      res.json(flight);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Deletar voo
  static async delete(req, res) {
    try {
      const flight = await Flight.findByIdAndDelete(req.params.id);
      if (flight && flight.gateId) {
        await Gate.findByIdAndUpdate(flight.gateId, { disponivel: true });
      }
      res.json({ message: 'Voo excluído' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = FlightController;