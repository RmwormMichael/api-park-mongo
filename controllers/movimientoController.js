const Movimiento = require('../models/movimientoModel');
const Vehicle = require('../models/vehicleModel');

// NOTA: Si Notificacion está dando problemas, lo manejaremos con try-catch
let Notificacion;
try {
  Notificacion = require('../models/notificacionModel');
} catch (error) {
  Notificacion = null;
}

const movimientoController = {

  async entrada(req, res) {
    try {
      const { idVehiculo } = req.body;

      const veh = await Vehicle.findById(idVehiculo);
      if (!veh) return res.status(404).json({ message: 'Vehículo no encontrado' });

      const active = await Movimiento.findOne({
        vehiculo: idVehiculo,
        estado: 'dentro'
      }).sort({ fechaEntrada: -1 });

      if (active) {
        return res.status(400).json({ message: 'Vehículo ya dentro' });
      }

      const mov = await Movimiento.create({
        vehiculo: idVehiculo
      });

      // Notificación con manejo de error
      if (Notificacion && veh.IdUsuario) {
        try {
          await Notificacion.createNotificacion(
            veh.IdUsuario,
            `Ingreso registrado para la placa ${veh.Placa}`
          );
        } catch (notifError) {
          console.error('Error al crear notificación:', notifError);
        }
      }

      res.json({
        message: 'Entrada registrada exitosamente',
        id: mov._id,
        placa: veh.Placa,
        movimiento: mov
      });

    } catch (err) {
      console.error('❌ Error en entrada:', err);
      res.status(500).json({ message: 'Error al registrar entrada' });
    }
  },

  async salida(req, res) {
    try {
      const { idMovimiento, placa } = req.body;
      let movimiento;

      // Opción 1: Por ID de movimiento
      if (idMovimiento) {
        movimiento = await Movimiento.findById(idMovimiento);
        if (movimiento && movimiento.estado === 'dentro') {
          movimiento.estado = 'fuera';
          movimiento.fechaSalida = new Date();
          await movimiento.save();
        }
      }

      // Opción 2: Por placa
      if (!movimiento && placa) {
        const veh = await Vehicle.findOne({ Placa: placa });
        if (!veh) return res.status(404).json({ message: 'Placa no encontrada' });

        movimiento = await Movimiento.findOne({
          vehiculo: veh._id,
          estado: 'dentro'
        }).sort({ fechaEntrada: -1 });

        if (!movimiento) {
          return res.status(400).json({ message: 'No hay registro de entrada activo' });
        }

        movimiento.estado = 'fuera';
        movimiento.fechaSalida = new Date();
        await movimiento.save();

        // Notificación con manejo de error
        if (Notificacion && veh.IdUsuario) {
          try {
            await Notificacion.createNotificacion(
              veh.IdUsuario,
              `Salida registrada para la placa ${veh.Placa}`
            );
          } catch (notifError) {
            console.error('Error al crear notificación:', notifError);
          }
        }
      }

      if (!movimiento) {
        return res.status(400).json({ message: 'Falta idMovimiento o placa' });
      }

      res.json({
        message: 'Salida registrada exitosamente',
        id: movimiento._id,
        placa: placa || 'N/A'
      });

    } catch (err) {
      console.error('❌ ERROR EN SALIDA:', err);
      res.status(500).json({ message: 'Error al registrar salida' });
    }
  },

  async listByRange(req, res) {
    try {
      const { start, end } = req.query;
      const { idRolName, id } = req.user;

      // Construir filtro de fecha
      const dateFilter = {};
      if (start && end) {
        dateFilter.fechaEntrada = {
          $gte: new Date(start),
          $lte: new Date(end)
        };
      }

      // Construir la consulta base
      let query = Movimiento.find(dateFilter)
        .populate({
          path: 'vehiculo',
          select: 'Placa Tipo Modelo Color IdUsuario',
          populate: {
            path: 'IdUsuario',
            select: 'NombreCompleto'
          }
        })
        .sort({ fechaEntrada: -1 });

      // Filtrar por usuario si no es admin/vigilante
      if (idRolName !== 'Administrador' && idRolName !== 'Vigilante') {
        // Primero obtener los vehículos del usuario
        const userVehicles = await Vehicle.find({ IdUsuario: id }, '_id');
        const vehicleIds = userVehicles.map(v => v._id);
        
        // Filtrar movimientos por vehículos del usuario
        query = query.where('vehiculo').in(vehicleIds);
      }

      const rows = await query;

      // Mapeo para el frontend
      const mapped = rows.map(m => ({
        IdMovimiento: m._id,
        Placa: m.vehiculo?.Placa || 'N/A',
        Tipo: m.vehiculo?.Tipo || 'N/A',
        Modelo: m.vehiculo?.Modelo || 'N/A',
        Color: m.vehiculo?.Color || 'N/A',
        NombreCompleto: m.vehiculo?.IdUsuario?.NombreCompleto || 'N/A',
        FechaEntrada: m.fechaEntrada,
        FechaSalida: m.fechaSalida,
        Estado: m.estado
      }));

      res.json(mapped);

    } catch (err) {
      console.error('❌ Error en listByRange:', err);
      res.status(500).json({ message: 'Error al listar movimientos' });
    }
  },

  async listAll(req, res) {
    try {
      const rows = await Movimiento.find()
        .populate({
          path: 'vehiculo',
          populate: {
            path: 'IdUsuario',
            select: 'NombreCompleto'
          }
        })
        .sort({ fechaEntrada: -1 });
      
      res.json(rows);
    } catch (err) {
      console.error('❌ Error en listAll:', err);
      res.status(500).json({ message: 'Error al listar todos los movimientos' });
    }
  },

  async vehiculosDentro(req, res) {
    try {
      const rows = await Movimiento.find({ estado: 'dentro' })
        .populate({
          path: 'vehiculo',
          populate: {
            path: 'IdUsuario',
            select: 'NombreCompleto Correo'
          }
        })
        .sort({ fechaEntrada: -1 });
      
      res.json(rows);
    } catch (err) {
      console.error('❌ Error en vehiculosDentro:', err);
      res.status(500).json({ message: 'Error al listar vehículos dentro' });
    }
  }
};

module.exports = movimientoController;