const Movimiento = require('./movimientoModel');

const Reporte = {
  async generate(fechaInicio, fechaFin, tipoVehiculo) {
    try {
      const startDate = new Date(fechaInicio + 'T00:00:00-05:00');
      const endDate = new Date(fechaFin + 'T23:59:59.999-05:00');

      const countMovimientos = await Movimiento.countDocuments({
        fechaEntrada: {
          $gte: startDate,
          $lte: endDate
        }
      });

      if (countMovimientos === 0) {
        return [];
      }

      // Construir pipeline de agregación CON zona horaria de Colombia
      const pipeline = [
        // Filtro por fecha
        {
          $match: {
            fechaEntrada: {
              $gte: startDate,
              $lte: endDate
            }
          }
        },
        // Lookup para obtener información del vehículo
        {
          $lookup: {
            from: 'vehicles',
            localField: 'vehiculo',
            foreignField: '_id',
            as: 'vehiculoInfo'
          }
        },
        { $unwind: '$vehiculoInfo' },
        // Filtro por tipo de vehículo si se especifica
        ...(tipoVehiculo && tipoVehiculo !== 'todos' ? [{
          $match: {
            'vehiculoInfo.Tipo': tipoVehiculo
          }
        }] : []),
        // Agrupar por fecha (convertida a Colombia) y tipo
        {
          $group: {
            _id: {
              fecha: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: '$fechaEntrada',
                  timezone: '-05:00' // Colombia UTC-5
                }
              },
              tipo: '$vehiculoInfo.Tipo'
            },
            total: { $sum: 1 }
          }
        },
        // Proyectar para formato de salida
        {
          $project: {
            _id: 0,
            fecha: '$_id.fecha',
            Tipo: '$_id.tipo',
            total: 1
          }
        },
        // Ordenar por fecha
        {
          $sort: {
            fecha: 1,
            Tipo: 1
          }
        }
      ];

      const result = await Movimiento.aggregate(pipeline);
      
      return result;

    } catch (error) {
      console.error('Error en generación de reporte:', error);
      throw error;
    }
  },

  async generateSummary(fechaInicio, fechaFin) {
    const startDate = new Date(fechaInicio + 'T00:00:00-05:00');
    const endDate = new Date(fechaFin + 'T23:59:59.999-05:00');

    const result = await Movimiento.aggregate([
      { $match: { fechaEntrada: { $gte: startDate, $lte: endDate } } },
      {
        $lookup: {
          from: 'vehicles',
          localField: 'vehiculo',
          foreignField: '_id',
          as: 'vehiculoInfo'
        }
      },
      { $unwind: '$vehiculoInfo' },
      {
        $group: {
          _id: '$vehiculoInfo.Tipo',
          total: { $sum: 1 }
        }
      },
      { $project: { _id: 0, Tipo: '$_id', total: 1 } },
      { $sort: { total: -1 } }
    ]);

    return result;
  }
};

module.exports = Reporte;