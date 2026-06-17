const movimientoSerializer = {
  toResponse(mov) {
    return {
      IdMovimiento: mov._id,
      Placa: mov.vehiculo?.Placa || 'N/A',
      Tipo: mov.vehiculo?.Tipo || 'N/A',
      Modelo: mov.vehiculo?.Modelo || 'N/A',
      Color: mov.vehiculo?.Color || 'N/A',
      NombreCompleto: mov.vehiculo?.IdUsuario?.NombreCompleto || 'N/A',
      FechaEntrada: mov.fechaEntrada,
      FechaSalida: mov.fechaSalida,
      Estado: mov.estado
    };
  }
};

module.exports = movimientoSerializer;
