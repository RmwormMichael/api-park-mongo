const path = require('path');
const fs = require('fs');

function deleteFileIfExists(relativePath) {
  if (!relativePath) return;
  const normalized = relativePath.replace(/^\/+/, '');
  const filePath = path.join(__dirname, '..', normalized);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

module.exports = { deleteFileIfExists };
