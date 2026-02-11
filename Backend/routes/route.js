const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Check controller path
const auth = require('../middleware/auth'); // Check middleware path

// Public Routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected Route (Requires JWT Token)
router.get('/profile', auth, authController.getProfile);

router.get('/all-users', auth, authController.getAllUsers);
router.delete('/delete-user/:id', auth, authController.deleteUser);

module.exports = router;