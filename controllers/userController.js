const User = require('../models/userModel');
const Vehicle = require('../models/vehicleModel');
const path = require('path');
const fs = require('fs');


// LISTAR USUARIOS
exports.list = async (req, res) => {
  try {
    const users = await User.find().select('-Contrasena');
    
    // Mapear _id a IdUsuario para mantener consistencia con el frontend
    const formattedUsers = users.map(user => ({
      IdUsuario: user._id,  // Esto es clave
      IdRol: user.IdRol,
      NombreRol: user.NombreRol,
      NombreCompleto: user.NombreCompleto,
      Documento: user.Documento,
      Correo: user.Correo,
      Telefono: user.Telefono,
      FotoPerfil: user.FotoPerfil,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
    
    res.json(formattedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar usuarios' });
  }
};

// OBTENER USUARIO POR ID
exports.get = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-Contrasena');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    
    // Formatear respuesta
    const formattedUser = {
      IdUsuario: user._id,  // Esto es clave
      IdRol: user.IdRol,
      NombreRol: user.NombreRol,
      NombreCompleto: user.NombreCompleto,
      Documento: user.Documento,
      Correo: user.Correo,
      Telefono: user.Telefono,
      FotoPerfil: user.FotoPerfil,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    res.json(formattedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};

// ACTUALIZAR USUARIO
exports.update = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    user.NombreCompleto = req.body.nombreCompleto ?? user.NombreCompleto;
    user.Documento = req.body.documento ?? user.Documento;
    user.Correo = req.body.correo ?? user.Correo;
    user.Telefono = req.body.telefono ?? user.Telefono;

    if (req.file) {
      if (user.FotoPerfil && user.FotoPerfil !== '/uploads/') {
        const oldPath = path.join(__dirname, '..', user.FotoPerfil);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      user.FotoPerfil = `/uploads/${req.file.filename}`;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

// ELIMINAR USUARIO
exports.remove = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (user.FotoPerfil && user.FotoPerfil !== '/uploads/') {
      const filePath = path.join(__dirname, '..', user.FotoPerfil);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await user.deleteOne();
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};


// OBTENER VEHÍCULOS DE UN USUARIO ESPECÍFICO
exports.getUserVehicles = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Verificar que el usuario existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Buscar vehículos del usuario
    const vehicles = await Vehicle.find({ IdUsuario: userId });

    // Formatear respuesta
    const formattedVehicles = vehicles.map(v => ({
      IdVehiculo: v._id,
      Placa: v.Placa,
      Tipo: v.Tipo,
      Modelo: v.Modelo,
      Color: v.Color,
      FotoVehiculo: v.FotoVehiculo,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt
    }));

    res.json(formattedVehicles);
  } catch (error) {
    console.error('Error al obtener vehículos del usuario:', error);
    res.status(500).json({ message: 'Error al cargar vehículos del usuario' });
  }
};
