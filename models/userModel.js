const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  IdRol: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4, 5]
  },
  NombreRol: {
    type: String,
    required: true,
    enum: ['Administrador', 'Instructor', 'Aprendiz', 'Visitante', 'Vigilante']
  },
  NombreCompleto: {
    type: String,
    required: true
  },
  Documento: {
    type: String,
    required: true
  },
  Correo: {
    type: String,
    required: true,
    unique: true
  },
  Telefono: {
    type: String,
    default: null
  },
  Contrasena: {
    type: String,
    required: true
  },
  FotoPerfil: {
    type: String,
    default: '/uploads/'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
