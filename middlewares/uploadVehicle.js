const { createUploadMiddleware } = require('./uploadFactory');

module.exports = createUploadMiddleware({
  subfolder: 'vehicles',
  prefix: 'vehicle',
  allowedTypes: /jpeg|jpg|png|gif|webp/,
  maxSize: 10 * 1024 * 1024
});
