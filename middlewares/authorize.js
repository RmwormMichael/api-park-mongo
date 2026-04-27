const { normalizeRole } = require('../constants/permissions');

const defaultMessages = {
  unauthorized: 'No auth',
  forbidden: 'Forbidden: insufficient role'
};

function authorize(...allowedRoles) {
  const normalizedAllowed = allowedRoles.map(normalizeRole).filter(Boolean);

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
