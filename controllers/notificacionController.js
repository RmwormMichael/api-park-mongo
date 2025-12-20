const Notificacion = require('../models/notificacionModel');

const notiController = {
  // Listar notificaciones del usuario autenticado
  async listForUser(req, res) {
    try {
      const idUsuario = req.params.userId || req.user.id;
      
      const notificaciones = await Notificacion.listForUser(idUsuario);
      
      // Formatear respuesta para mantener consistencia con frontend
      const formatted = notificaciones.map(notif => ({
        IdNotificacion: notif._id,
        IdUsuario: notif.IdUsuario?._id,
        UsuarioNombre: notif.IdUsuario?.NombreCompleto,
        Mensaje: notif.Mensaje,
        Leido: notif.Leido,
        FechaCreacion: notif.FechaCreacion || notif.createdAt,
        Fecha: notif.FechaCreacion || notif.createdAt  // Para compatibilidad
      }));
      
      res.json(formatted);
    } catch (error) {
      console.error('Error al listar notificaciones:', error);
      res.status(500).json({ message: 'Error al cargar notificaciones' });
    }
  },

  // Marcar notificación como leída
  async markRead(req, res) {
    try {
      const id = req.params.id;
      
      await Notificacion.markRead(id);
      
      res.json({ message: 'Notificación marcada como leída' });
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
      res.status(500).json({ 
        message: error.message || 'Error al marcar notificación como leída' 
      });
    }
  },

  // Contar notificaciones no leídas
  async countUnread(req, res) {
    try {
      const idUsuario = req.user.id;
      
      const count = await Notificacion.countUnread(idUsuario);
      
      res.json({ count });
    } catch (error) {
      console.error('Error al contar notificaciones no leídas:', error);
      res.status(500).json({ message: 'Error al contar notificaciones' });
    }
  },

  // Crear notificación (para uso interno)
  async create(req, res) {
    try {
      const { IdUsuario, Mensaje } = req.body;
      
      const notificacion = await Notificacion.createNotificacion(IdUsuario, Mensaje);
      
      res.status(201).json({
        message: 'Notificación creada',
        id: notificacion._id
      });
    } catch (error) {
      console.error('Error al crear notificación:', error);
      res.status(500).json({ message: 'Error al crear notificación' });
    }
  },

  // Eliminar notificación
  async remove(req, res) {
    try {
      const id = req.params.id;
      
      const notificacion = await Notificacion.findByIdAndDelete(id);
      
      if (!notificacion) {
        return res.status(404).json({ message: 'Notificación no encontrada' });
      }
      
      res.json({ message: 'Notificación eliminada' });
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
      res.status(500).json({ message: 'Error al eliminar notificación' });
    }
  }
};

module.exports = notiController;