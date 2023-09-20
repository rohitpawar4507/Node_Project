const jwt = require('jsonwebtoken');

// Generate a JWT token
function generateToken(userId) {
  return jwt.sign({ userId }, 'rohitPawar', { expiresIn: '1h' });
}

// Verify and decode a JWT token
function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, 'rohitPawar', (err, decoded) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(decoded);
    });
  });
}

module.exports = {
  generateToken,
  verifyToken,
};
