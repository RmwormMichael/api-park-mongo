const Movimiento = require('./movimientoModel');

const Reporte = {
  async generate(fechaInicio, fechaFin, tipoVehiculo) {
    try {
      console.log('=== DEPURACIÓN DE REPORTE ===');
      console.log('Fecha inicio (parámetro):', fechaInicio);
      console.log('Fecha fin (parámetro):', fechaFin);
      console.log('Tipo vehículo:', tipoVehiculo);

      // IMPORTANTE: Ajustar para zona horaria de Colombia (UTC-5)
      // Cuando el usuario selecciona 2025-12-20, quiere todo ese día en hora Colombia
      const startDate = new Date(fechaInicio + 'T00:00:00-05:00'); // Inicio del día en Colombia
      const endDate = new Date(fechaFin + 'T23:59:59.999-05:00'); // Fin del día en Colombia
      
      console.log('Fecha inicio (Date UTC):', startDate.toISOString());
      console.log('Fecha fin (Date UTC):', endDate.toISOString());

      // Primero, verifiquemos si hay movimientos en ese rango
      const countMovimientos = await Movimiento.countDocuments({
        fechaEntrada: {
          $gte: startDate,
          $lte: endDate
        }
      });
      console.log(`Total de movimientos en el rango: ${countMovimientos}`);

      // También contar todos los movimientos para debug
      const totalTodos = await Movimiento.countDocuments();
      console.log(`Total de movimientos en la BD: ${totalTodos}`);

      // Ver algunos movimientos de ejemplo
      const sampleMovimientos = await Movimiento.find()
        .sort({ fechaEntrada: -1 })
        .limit(3);
      console.log('Movimientos de ejemplo:', sampleMovimientos.map(m => ({
        id: m._id,
        fechaEntrada: m.fechaEntrada,
        fechaEntradaISO: m.fechaEntrada.toISOString()
      })));

      if (countMovimientos === 0) {
        console.log('⚠️ No hay movimientos en el rango especificado');
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

      console.log('Pipeline de reporte:', JSON.stringify(pipeline, null, 2));
      
      const result = await Movimiento.aggregate(pipeline);
      console.log('Resultado del reporte:', result);
      
      return result;

    } catch (error) {
      console.error('Error en generación de reporte:', error);
      throw error;
    }
  }
};

module.exports = Reporte;