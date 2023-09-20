// //1. Code without redis
// // middleware/authMiddleware.js

// const jwt = require('jsonwebtoken');
// const redisClient = require('../config/redisConn');

// function authenticateToken(req, res, next) {
//   const token = req.header('Authorization');
//   if (!token) return res.status(401).json({ message: 'Access denied' });

//   jwt.verify(token, 'rohitPawar', (err, user) => {
//     if (err) return res.status(403).json({ message: 'Invalid token' });

//     req.user = user;
//     next();
//   });
// }

// module.exports = authenticateToken;

//---------------- Final code with redis auththentication ---------------------------------------


const jwt = require('jsonwebtoken');
const { get } = require('../utils/redisUtils');

function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  // Verify the token and set req.user
  jwt.verify(token, 'rohitPawar', (err, user) => {
    if (err) {
      console.error('JWT Verification Error:', err);
      return res.status(403).json({ message: 'Invalid token' });
    }
    // Retrieve the token from Redis for comparison
    get(user.userId.toString())
      .then((storedToken) => {
        if (!storedToken || token !== storedToken) {
          return res.status(403).json({ message: 'Invalid token' });
        }
        // Token is valid, set req.user
        req.user = user;
        next();
      })
      .catch((err) => {
        console.error('Redis Error:', err);
        return res.status(500).json({ message: 'Internal server error' });
      });
  });
}

module.exports = authenticateToken;