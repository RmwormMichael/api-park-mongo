const userSerializer = {
  toResponse(user) {
    return {
      IdUsuario: user._id,
      IdRol: user.IdRol,
      NombreRol: user.NombreRol,
      NombreCompleto: user.NombreCompleto,
      Documento: user.Documento,
      Correo: user.Correo,
      Telefono: user.Telefono,
      FotoPerfil: user.FotoPerfil,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
};

module.exports = userSerializer;
