const Vehicle = require('../models/vehicleModel');
const vehicleSerializer = require('../serializers/vehicleSerializer');
const { deleteFileIfExists } = require('../utils/fileUtils');

const vehicleController = {

  // CREAR VEHÍCULO
  async create(req, res) {
    try {
      const data = req.body;

      const exists = await Vehicle.findOne({ Placa: data.placa.toUpperCase() });
      if (exists) {
        if (req.file) deleteFileIfExists('uploads/vehicles/' + req.file.filename);
        return res.status(400).json({ message: 'Placa ya registrada' });
      }

      const vehicle = await Vehicle.create({
        IdUsuario: req.user.id,
        Placa: data.placa,
        Tipo: data.tipo,
        Modelo: data.modelo,
        Color: data.color,
        FotoVehiculo: req.file
          ? `/uploads/vehicles/${req.file.filename}`
          : undefined
      });

      res.status(201).json({
        message: 'Vehículo registrado',
        id: vehicle._id,
        foto: vehicle.FotoVehiculo
      });

    } catch (error) {
      console.error(error);
      if (req.file) deleteFileIfExists('uploads/vehicles/' + req.file.filename);
      res.status(500).json({ message: 'Error al registrar vehículo' });
    }
  },

  // VEHÍCULOS DEL USUARIO
async listByUser(req, res) {
  try {
    const vehicles = await Vehicle
      .find({ IdUsuario: req.user.id })
      .populate('IdUsuario', 'NombreCompleto Correo NombreRol')
      .sort({ Placa: 1 });

    res.json(vehicles.map(vehicleSerializer.toFullResponse));
  } catch (error) {
    res.status(500).json({ message: 'Error al cargar vehículos' });
  }
},

  // LISTAR TODOS (ADMIN / VIGILANTE)
  async listAll(req, res) {
  try {
    const vehicles = await Vehicle
      .find()
      .populate('IdUsuario', 'NombreCompleto Correo NombreRol')
      .sort({ Placa: 1 });

    res.json(vehicles.map(vehicleSerializer.toFullResponse));
  } catch (error) {
    res.status(500).json({ message: 'Error al cargar vehículos' });
  }
},

  // ELIMINAR VEHÍCULO
  async remove(req, res) {
    try {
      const vehicle = await Vehicle.findById(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ message: 'Vehículo no encontrado' });
      }

      if (vehicle.FotoVehiculo && vehicle.FotoVehiculo !== '/uploads/vehicles/') {
        deleteFileIfExists(vehicle.FotoVehiculo);
      }

      await vehicle.deleteOne();
      res.json({ message: 'Vehículo eliminado correctamente' });

    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar vehículo' });
    }
  }
};

module.exports = vehicleController;
