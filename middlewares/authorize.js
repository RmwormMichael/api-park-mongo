const { normalizeRole } = require('../constants/permissions');

const defaultMessages = {
  unauthorized: 'No autenticado',
  forbidden: 'No tiene permisos para esta acción'
};

function authorize(...allowedRoles) {
  const normalizedAllowed = allowedRoles.map(normalizeRole).filter(Boolean);
  if (normalizedAllowed.length === 0) {
    return (req, res, next) => res.status(500).json({ message: 'Error de configuración: lista de roles vacía' });
  }

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: defaultMessages.unauthorized });
    }

    const userRoleName = req.user.idRolName || req.user.NombreRol || null;
    const userRoleId = req.user.idRol || req.user.IdRol || null;

    const normalizedByName = normalizeRole(userRoleName);
    const normalizedById = normalizeRole(userRoleId);

    const isAllowed =
      normalizedAllowed.includes(normalizedByName) ||
      normalizedAllowed.includes(normalizedById);

    if (!isAllowed) {
      return res.status(403).json({ message: defaultMessages.forbidden });
    }

    return next();
  };
}

module.exports = authorize;
