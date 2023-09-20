const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware'); // Import the authentication middleware

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/all-data', authenticateToken, authController.getAllData);
router.get('/user/:id', authenticateToken, authController.getUserById); // Get user by ID
router.put('/user/:id', authenticateToken, authController.updateUserById); // Update user by ID
router.delete('/user/:id', authenticateToken, authController.deleteUserById); // Delete user by ID

module.exports = router;
