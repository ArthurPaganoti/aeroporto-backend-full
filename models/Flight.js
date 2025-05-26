const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  numeroVoo: { type: String, required: true, unique: true },
  origem: { type: String, required: true },
  destino: { type: String, required: true },
  dataHoraPartida: { type: Date, required: true },
  gateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gate', required: true },
  status: { type: String, enum: ['programado', 'embarque', 'concluido'], default: 'programado' }
});

// liberar portão ao concluir voo
flightSchema.pre('save', async function(next) {
  if (this.isModified('status') && this.status === 'concluido' && this.gateId) { // Corrigido aqui
    const Gate = require('./Gate');
    await Gate.findByIdAndUpdate(this.gateId, { disponivel: true });
  }
  next();
});

module.exports = mongoose.model('Flight', flightSchema);