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

  // OBTENER VEHÍCULO POR ID (con estado de ingreso activo)
  async getById(req, res) {
    try {
      const vehicle = await Vehicle.findById(req.params.id)
        .populate('IdUsuario', 'NombreCompleto Correo NombreRol');

      if (!vehicle) {
        return res.status(404).json({ message: 'Vehículo no encontrado' });
      }

      const Movimiento = require('../models/movimientoModel');
      const activeEntry = await Movimiento.findOne({
        vehiculo: req.params.id,
        estado: 'dentro'
      });

      const response = vehicleSerializer.toFullResponse(vehicle);
      response.TieneIngresoActivo = !!activeEntry;

      res.json(response);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener vehículo' });
    }
  },

  // ACTUALIZAR VEHÍCULO
  async update(req, res) {
    try {
      const vehicle = await Vehicle.findById(req.params.id);
      if (!vehicle) {
        if (req.file) deleteFileIfExists('uploads/vehicles/' + req.file.filename);
        return res.status(404).json({ message: 'Vehículo no encontrado' });
      }

      const userRole = req.user.idRolName || req.user.NombreRol;
      const isAdmin = userRole === 'Administrador';
      const isBasicRole = ['Aprendiz', 'Instructor', 'Visitante'].includes(userRole);

      // Vigilante no puede editar
      if (userRole === 'Vigilante') {
        if (req.file) deleteFileIfExists('uploads/vehicles/' + req.file.filename);
        return res.status(403).json({ message: 'No tienes permisos para editar vehículos' });
      }

      // Ownership check for non-admin
      if (!isAdmin && vehicle.IdUsuario.toString() !== req.user.id) {
        if (req.file) deleteFileIfExists('uploads/vehicles/' + req.file.filename);
        return res.status(403).json({ message: 'No tienes permisos para editar este vehículo' });
      }

      // Check active entry (only blocks non-admin roles)
      const Movimiento = require('../models/movimientoModel');
      const activeEntry = await Movimiento.findOne({
        vehiculo: req.params.id,
        estado: 'dentro'
      });

      if (isBasicRole) {
        if (activeEntry) {
          if (req.file) deleteFileIfExists('uploads/vehicles/' + req.file.filename);
          return res.status(400).json({ message: 'No puedes modificar la foto mientras el vehículo tenga un ingreso activo' });
        }

        // Basic roles can only update photo — reject any text fields
        if (req.body.placa || req.body.tipo || req.body.modelo || req.body.color) {
          if (req.file) deleteFileIfExists('uploads/vehicles/' + req.file.filename);
          return res.status(403).json({ message: 'Solo puedes modificar la fotografía de tu vehículo' });
        }

        if (!req.file) {
          return res.status(400).json({ message: 'No hay cambios para guardar' });
        }

        if (vehicle.FotoVehiculo && vehicle.FotoVehiculo !== '/uploads/vehicles/') {
          deleteFileIfExists(vehicle.FotoVehiculo);
        }
        vehicle.FotoVehiculo = `/uploads/vehicles/${req.file.filename}`;
      }

      if (isAdmin) {
        if (req.body.placa !== undefined) {
          const newPlaca = req.body.placa.trim().toUpperCase();
          const existing = await Vehicle.findOne({ Placa: newPlaca, _id: { $ne: req.params.id } });
          if (existing) {
            if (req.file) deleteFileIfExists('uploads/vehicles/' + req.file.filename);
            return res.status(400).json({ message: 'Placa ya registrada' });
          }
          vehicle.Placa = newPlaca;
        }
        if (req.body.tipo !== undefined) vehicle.Tipo = req.body.tipo.trim();
        if (req.body.modelo !== undefined) vehicle.Modelo = req.body.modelo.trim();
        if (req.body.color !== undefined) vehicle.Color = req.body.color.trim();
        if (req.file) {
          if (vehicle.FotoVehiculo && vehicle.FotoVehiculo !== '/uploads/vehicles/') {
            deleteFileIfExists(vehicle.FotoVehiculo);
          }
          vehicle.FotoVehiculo = `/uploads/vehicles/${req.file.filename}`;
        }
      }

      await vehicle.save();

      const updated = await Vehicle.findById(vehicle._id)
        .populate('IdUsuario', 'NombreCompleto Correo NombreRol');

      res.json(vehicleSerializer.toFullResponse(updated));

    } catch (error) {
      console.error(error);
      if (req.file) deleteFileIfExists('uploads/vehicles/' + req.file.filename);
      res.status(500).json({ message: 'Error al actualizar vehículo' });
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
