const movimientoService = require('../services/movimientoService');
const movimientoSerializer = require('../serializers/movimientoSerializer');

const movimientoController = {

  async entrada(req, res) {
    try {
      const { idVehiculo } = req.body;
      const { movimiento, placa } = await movimientoService.entrada(idVehiculo);

      res.json({
        message: 'Entrada registrada exitosamente',
        id: movimiento._id,
        placa,
        movimiento
      });

    } catch (err) {
      if (err.statusCode) return res.status(err.statusCode).json({ message: err.message });
      console.error('Error en entrada:', err);
      res.status(500).json({ message: 'Error al registrar entrada' });
    }
  },

  async salida(req, res) {
    try {
      const { idMovimiento, placa } = req.body;
      const { movimiento } = await movimientoService.salida({ idMovimiento, placa });

      res.json({
        message: 'Salida registrada exitosamente',
        id: movimiento._id,
        placa: placa || 'N/A'
      });

    } catch (err) {
      if (err.statusCode) return res.status(err.statusCode).json({ message: err.message });
      console.error('Error en salida:', err);
      res.status(500).json({ message: 'Error al registrar salida' });
    }
  },

  async listByRange(req, res) {
    try {
      const { start, end } = req.query;
      const rows = await movimientoService.listByRange({
        start,
        end,
        userRole: req.user.idRolName,
        userId: req.user.id
      });

      res.json(rows.map(movimientoSerializer.toResponse));

    } catch (err) {
      console.error('Error en listByRange:', err);
      res.status(500).json({ message: 'Error al listar movimientos' });
    }
  },

  async listAll(req, res) {
    try {
      const rows = await movimientoService.listAll();
      res.json(rows);
    } catch (err) {
      console.error('Error en listAll:', err);
      res.status(500).json({ message: 'Error al listar todos los movimientos' });
    }
  },

  async vehiculosDentro(req, res) {
    try {
      const rows = await movimientoService.vehiculosDentro();
      res.json(rows);
    } catch (err) {
      console.error('Error en vehiculosDentro:', err);
      res.status(500).json({ message: 'Error al listar vehículos dentro' });
    }
  }
};

module.exports = movimientoController;