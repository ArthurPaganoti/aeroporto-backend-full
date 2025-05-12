const mongoose = require('mongoose');
const passengerSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cpf: { type: String, required: true, unique: true, match: /\d{11}/ },
  vooId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },
  statusCheckIn: { type: String, enum: ['pendente', 'realizado'], default: 'pendente' }
});
module.exports = mongoose.model('Passenger', passengerSchema);
