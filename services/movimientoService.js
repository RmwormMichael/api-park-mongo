const Movimiento = require('../models/movimientoModel');
const Vehicle = require('../models/vehicleModel');

let Notificacion;
try {
  Notificacion = require('../models/notificacionModel');
} catch (error) {
  console.error('Error al cargar notificacionModel:', error);
  Notificacion = null;
}

class MovimientoServiceError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const movimientoService = {
  async entrada(idVehiculo) {
    const veh = await Vehicle.findById(idVehiculo);
    if (!veh) throw new MovimientoServiceError('Vehículo no encontrado', 404);

    const active = await Movimiento.findOne({
      vehiculo: idVehiculo,
      estado: 'dentro'
    }).sort({ fechaEntrada: -1 });

    if (active) throw new MovimientoServiceError('Vehículo ya dentro', 400);

    const mov = await Movimiento.create({ vehiculo: idVehiculo });

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

    return { movimiento: mov, placa: veh.Placa };
  },

  async salida({ idMovimiento, placa }) {
    let movimiento;

    if (idMovimiento) {
      movimiento = await Movimiento.findById(idMovimiento);
      if (movimiento && movimiento.estado === 'dentro') {
        movimiento.estado = 'fuera';
        movimiento.fechaSalida = new Date();
        await movimiento.save();
      }
    }

    if (!movimiento && placa) {
      const veh = await Vehicle.findOne({ Placa: placa });
      if (!veh) throw new MovimientoServiceError('Placa no encontrada', 404);

      movimiento = await Movimiento.findOne({
        vehiculo: veh._id,
        estado: 'dentro'
      }).sort({ fechaEntrada: -1 });

      if (!movimiento) throw new MovimientoServiceError('No hay registro de entrada activo', 400);

      movimiento.estado = 'fuera';
      movimiento.fechaSalida = new Date();
      await movimiento.save();

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

    if (!movimiento) throw new MovimientoServiceError('Falta idMovimiento o placa', 400);

    return { movimiento };
  },

  async listByRange({ start, end, userRole, userId }) {
  const dateFilter = {};

  if (start && end) {

    const startDate = new Date(`${start}T00:00:00-05:00`);
    const endDate = new Date(`${end}T23:59:59.999-05:00`);

    dateFilter.fechaEntrada = {
      $gte: startDate,
      $lte: endDate
    };
  }


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

  const isAdminOrVigilante =
    userRole === 'Administrador' ||
    userRole === 'Vigilante';

  if (!isAdminOrVigilante) {
    const userVehicles = await Vehicle.find(
      { IdUsuario: userId },
      '_id'
    );

    const vehicleIds = userVehicles.map(v => v._id);

    query = query.where('vehiculo').in(vehicleIds);
  }

  return await query;
},

  async listAll() {
    return await Movimiento.find()
      .populate({
        path: 'vehiculo',
        populate: {
          path: 'IdUsuario',
          select: 'NombreCompleto'
        }
      })
      .sort({ fechaEntrada: -1 });
  },

  async vehiculosDentro() {
    return await Movimiento.find({ estado: 'dentro' })
      .populate({
        path: 'vehiculo',
        populate: {
          path: 'IdUsuario',
          select: 'NombreCompleto Correo'
        }
      })
      .sort({ fechaEntrada: -1 });
  }
};

module.exports = movimientoService;
