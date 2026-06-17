const { createUploadMiddleware } = require('./uploadFactory');

module.exports = createUploadMiddleware({
  subfolder: '',
  prefix: 'profile',
  allowedTypes: /jpeg|jpg|png|gif/,
  maxSize: 5 * 1024 * 1024
});
