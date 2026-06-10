const { body, param, query, validationResult } = require('express-validator');

const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

const registerRules = [
  body('nombreCompleto').trim().notEmpty().withMessage('El nombre completo es requerido'),
  body('documento').trim().notEmpty().withMessage('El documento es requerido'),
  body('correo').isEmail().withMessage('Correo electrónico inválido').normalizeEmail(),
  body('contrasena').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('idRol').isIn([2, 3, 4]).withMessage('Rol no permitido').toInt(),
  body('telefono').optional({ values: 'falsy' }).trim(),
  validateResult
];

const loginRules = [
  body('correo').notEmpty().withMessage('El correo es requerido').isEmail().withMessage('Correo electrónico inválido').normalizeEmail(),
  body('contrasena').notEmpty().withMessage('La contraseña es requerida'),
  validateResult
];

const vehicleRules = [
  body('placa').trim().notEmpty().withMessage('La placa es requerida').isLength({ min: 3 }).withMessage('La placa debe tener al menos 3 caracteres'),
  body('tipo').trim().notEmpty().withMessage('El tipo de vehículo es requerido'),
  body('modelo').trim().notEmpty().withMessage('El modelo es requerido'),
  body('color').trim().notEmpty().withMessage('El color es requerido'),
  validateResult
];

const entradaRules = [
  body('idVehiculo').notEmpty().withMessage('El ID del vehículo es requerido').isMongoId().withMessage('ID de vehículo inválido'),
  validateResult
];

const salidaRules = [
  body('idMovimiento').optional({ values: 'falsy' }).isMongoId().withMessage('ID de movimiento inválido'),
  body('placa').optional({ values: 'falsy' }).trim().isLength({ min: 3 }).withMessage('Placa inválida'),
  validateResult
];

const rangeRules = [
  query('start').optional({ values: 'falsy' }).matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Fecha de inicio inválida (formato YYYY-MM-DD)'),
  query('end').optional({ values: 'falsy' }).matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Fecha de fin inválida (formato YYYY-MM-DD)'),
  validateResult
];

const notificacionUserRules = [
  param('userId').isMongoId().withMessage('ID de usuario inválido'),
  validateResult
];

const notificacionReadRules = [
  param('id').isMongoId().withMessage('ID de notificación inválido'),
  validateResult
];

const reporteCreateRules = [
  body('fechaInicio').notEmpty().withMessage('La fecha de inicio es requerida').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Fecha de inicio inválida (formato YYYY-MM-DD)'),
  body('fechaFin').notEmpty().withMessage('La fecha de fin es requerida').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Fecha de fin inválida (formato YYYY-MM-DD)'),
  body('tipoVehiculo').optional({ values: 'falsy' }).trim(),
  validateResult
];

const reporteGetRules = [
  query('fechaInicio').notEmpty().withMessage('La fecha de inicio es requerida').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Fecha de inicio inválida (formato YYYY-MM-DD)'),
  query('fechaFin').notEmpty().withMessage('La fecha de fin es requerida').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Fecha de fin inválida (formato YYYY-MM-DD)'),
  query('tipoVehiculo').optional({ values: 'falsy' }).trim(),
  validateResult
];

const reporteStatsRules = [
  query('fechaInicio').notEmpty().withMessage('La fecha de inicio es requerida').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Fecha de inicio inválida (formato YYYY-MM-DD)'),
  query('fechaFin').notEmpty().withMessage('La fecha de fin es requerida').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Fecha de fin inválida (formato YYYY-MM-DD)'),
  validateResult
];

const userIdRules = [
  param('id').isMongoId().withMessage('ID de usuario inválido'),
  validateResult
];

const userUpdateRules = [
  param('id').isMongoId().withMessage('ID de usuario inválido'),
  body('nombreCompleto').optional({ values: 'falsy' }).trim(),
  body('documento').optional({ values: 'falsy' }).trim(),
  body('correo').optional({ values: 'falsy' }).isEmail().withMessage('Correo electrónico inválido').normalizeEmail(),
  body('telefono').optional({ values: 'falsy' }).trim(),
  validateResult
];

const userDeleteRules = [
  param('id').isMongoId().withMessage('ID de usuario inválido'),
  validateResult
];

const vehicleDeleteRules = [
  param('id').isMongoId().withMessage('ID de vehículo inválido'),
  validateResult
];

module.exports = {
  validateResult,
  registerRules,
  loginRules,
  vehicleRules,
  entradaRules,
  salidaRules,
  rangeRules,
  notificacionUserRules,
  notificacionReadRules,
  reporteCreateRules,
  reporteGetRules,
  reporteStatsRules,
  userIdRules,
  userUpdateRules,
  userDeleteRules,
  vehicleDeleteRules
};
