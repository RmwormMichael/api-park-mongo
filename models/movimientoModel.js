const mongoose = require('mongoose');

const MovimientoSchema = new mongoose.Schema({
  vehiculo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  fechaEntrada: {
    type: Date,
    default: Date.now,
    required: true
  },
  fechaSalida: {
    type: Date
  },
  estado: {
    type: String,
    enum: ['dentro', 'fuera'],
    default: 'dentro',
    required: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para mejor rendimiento
MovimientoSchema.index({ vehiculo: 1, estado: 1 });
MovimientoSchema.index({ vehiculo: 1, estado: 1 }, {
  unique: true,
  partialFilterExpression: { estado: 'dentro' }
});
MovimientoSchema.index({ fechaEntrada: -1 });
MovimientoSchema.index({ estado: 1, fechaEntrada: -1 });

module.exports = mongoose.model('Movimiento', MovimientoSchema);