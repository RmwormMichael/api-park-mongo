function ownership(options = {}) {
  const {
    source = 'params',
    field = 'id',
    authUserField = 'id',
    allowRoles = []
  } = options;

  const sources = Array.isArray(source) ? source : [source];
  const allowedRoleSet = new Set(allowRoles.map(String));

  return (req, res, next) => {
    if (!req.user || req.user[authUserField] === undefined || req.user[authUserField] === null) {
      return res.status(401).json({ message: 'No auth' });
    }

    const userRoleName = req.user.idRolName || req.user.NombreRol;
    if (userRoleName && allowedRoleSet.has(String(userRoleName))) {
      return next();
    }

    const targetId = sources.reduce((acc, src) => {
      if (acc !== null && acc !== undefined) return acc;
      const bucket = req[src];
      if (!bucket) return acc;
      return bucket[field];
    }, null);

    if (targetId === null || targetId === undefined) {
      return res.status(400).json({ message: `Missing ownership field: ${field}` });
    }

    const authenticatedUserId = String(req.user[authUserField]);
    const resourceUserId = String(targetId);

    if (authenticatedUserId !== resourceUserId) {
      return res.status(403).json({ message: 'Forbidden: not owner of resource' });
    }

    return next();
  };
}

module.exports = ownership;
