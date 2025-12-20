const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  IdUsuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  Placa: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  Tipo: {
    type: String,
    required: true
  },
  Modelo: {
    type: String,
    required: true
  },
  Color: {
    type: String,
    required: true
  },
  FotoVehiculo: {
    type: String,
    default: '/uploads/vehicles/'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
