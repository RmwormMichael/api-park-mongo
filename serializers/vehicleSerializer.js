const vehicleSerializer = {
  toFullResponse(vehicle) {
    return {
      IdVehiculo: vehicle._id,
      Placa: vehicle.Placa,
      Tipo: vehicle.Tipo,
      Modelo: vehicle.Modelo,
      Color: vehicle.Color,
      FotoVehiculo: vehicle.FotoVehiculo,
      NombreCompleto: vehicle.IdUsuario?.NombreCompleto,
      Correo: vehicle.IdUsuario?.Correo,
      NombreRol: vehicle.IdUsuario?.NombreRol,
      IdUsuario: vehicle.IdUsuario?._id
    };
  },

  toSimpleResponse(vehicle) {
    return {
      IdVehiculo: vehicle._id,
      Placa: vehicle.Placa,
      Tipo: vehicle.Tipo,
      Modelo: vehicle.Modelo,
      Color: vehicle.Color,
      FotoVehiculo: vehicle.FotoVehiculo,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt
    };
  }
};

module.exports = vehicleSerializer;
