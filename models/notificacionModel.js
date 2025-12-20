const mongoose = require('mongoose');

const NotificacionSchema = new mongoose.Schema({
  IdUsuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  Mensaje: {
    type: String,
    required: true
  },
  Leido: {
    type: Boolean,
    default: false
  },
  FechaCreacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true  // Esto agrega createdAt y updatedAt automáticamente
});

// Método estático para crear notificaciones
NotificacionSchema.statics.createNotificacion = async function(IdUsuario, Mensaje) {
  try {
    const notificacion = await this.create({
      IdUsuario,
      Mensaje
    });
    return notificacion;
  } catch (error) {
    console.error('Error al crear notificación:', error);
    throw error;
  }
};

// Método estático para listar notificaciones de un usuario
NotificacionSchema.statics.listForUser = async function(idUsuario) {
  try {
    const notificaciones = await this.find({ IdUsuario: idUsuario })
      .sort({ FechaCreacion: -1 })
      .populate('IdUsuario', 'NombreCompleto Correo');
    
    return notificaciones;
  } catch (error) {
    console.error('Error al listar notificaciones:', error);
    throw error;
  }
};

// Método estático para marcar como leída
NotificacionSchema.statics.markRead = async function(idNotificacion) {
  try {
    const notificacion = await this.findByIdAndUpdate(
      idNotificacion,
      { Leido: true },
      { new: true }
    );
    
    if (!notificacion) {
      throw new Error('Notificación no encontrada');
    }
    
    return notificacion;
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    throw error;
  }
};

// Método estático para contar notificaciones no leídas
NotificacionSchema.statics.countUnread = async function(idUsuario) {
  try {
    const count = await this.countDocuments({
      IdUsuario: idUsuario,
      Leido: false
    });
    return count;
  } catch (error) {
    console.error('Error al contar notificaciones no leídas:', error);
    throw error;
  }
};

const Notificacion = mongoose.model('Notificacion', NotificacionSchema);

module.exports = Notificacion;