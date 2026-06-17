const User = require('../models/userModel');
const Vehicle = require('../models/vehicleModel');
const userSerializer = require('../serializers/userSerializer');
const vehicleSerializer = require('../serializers/vehicleSerializer');
const { deleteFileIfExists } = require('../utils/fileUtils');


// LISTAR USUARIOS
exports.list = async (req, res) => {
  try {
    const users = await User.find().select('-Contrasena');

    const formattedUsers = users.map(userSerializer.toResponse);

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

    res.json(userSerializer.toResponse(user));
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
        deleteFileIfExists(user.FotoPerfil);
      }
      user.FotoPerfil = `/uploads/${req.file.filename}`;
    }

    await user.save();
    res.json(userSerializer.toResponse(user));
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
      deleteFileIfExists(user.FotoPerfil);
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

    res.json(vehicles.map(vehicleSerializer.toSimpleResponse));
  } catch (error) {
    console.error('Error al obtener vehículos del usuario:', error);
    res.status(500).json({ message: 'Error al cargar vehículos del usuario' });
  }
};
