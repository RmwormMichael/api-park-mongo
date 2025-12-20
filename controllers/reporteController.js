const Reporte = require('../models/reporteModel');

const reporteController = {

  async createAndGenerate(req, res) {
    try {
      const { fechaInicio, fechaFin, tipoVehiculo } = req.body;

      // Validar parámetros requeridos
      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ 
          message: 'Las fechas de inicio y fin son requeridas' 
        });
      }

      const data = await Reporte.generate(
        fechaInicio,
        fechaFin,
        tipoVehiculo || 'todos'
      );

      // En MongoDB no necesitamos guardar el reporte como documento separado
      // pero podemos devolver un ID simulado para compatibilidad
      const idReporte = `rep_${Date.now()}`;

      res.json({
        idReporte,
        data,
        metadata: {
          fechaInicio,
          fechaFin,
          tipoVehiculo: tipoVehiculo || 'todos',
          totalRegistros: data.length,
          fechaGeneracion: new Date()
        }
      });

    } catch (error) {
      console.error('Error en createAndGenerate:', error);
      res.status(500).json({ 
        message: 'Error al generar reporte',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async generateOnly(req, res) {
    try {
      const { fechaInicio, fechaFin, tipoVehiculo } = req.query;

      // Validar parámetros requeridos
      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ 
          message: 'Los parámetros fechaInicio y fechaFin son requeridos en la consulta' 
        });
      }

      console.log('Generando reporte con parámetros:', {
        fechaInicio,
        fechaFin,
        tipoVehiculo: tipoVehiculo || 'todos'
      });

      const data = await Reporte.generate(
        fechaInicio,
        fechaFin,
        tipoVehiculo || 'todos'
      );

      console.log('Datos generados:', data);

      // Asegurarse de que los datos tengan el formato esperado por el frontend
      const formattedData = data.map(item => ({
        fecha: item.fecha,
        Tipo: item.Tipo,
        total: item.total
      }));

      res.json(formattedData);

    } catch (error) {
      console.error('Error en generateOnly:', error);
      res.status(500).json({ 
        message: 'Error al generar reporte',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Método adicional para obtener estadísticas rápidas
  async getStats(req, res) {
    try {
      const { fechaInicio, fechaFin } = req.query;

      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ 
          message: 'Las fechas de inicio y fin son requeridas' 
        });
      }

      const summary = await Reporte.generateSummary(fechaInicio, fechaFin);
      
      // Calcular total general
      const totalGeneral = summary.reduce((sum, item) => sum + item.total, 0);
      
      res.json({
        summary,
        totalGeneral,
        fechaInicio,
        fechaFin
      });

    } catch (error) {
      console.error('Error en getStats:', error);
      res.status(500).json({ 
        message: 'Error al obtener estadísticas' 
      });
    }
  }
};

module.exports = reporteController;