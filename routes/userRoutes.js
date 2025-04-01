const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/guest-login', userController.guestLogin);

// Protected routes
router.get('/current-user', authMiddleware, userController.getCurrentUser);
router.put('/user/update', authMiddleware, userController.updateUser);
router.delete('/user/delete', authMiddleware, userController.deleteUser);

// Optional: Other CRUD routes if needed
router.post('/user', userController.createUser);
router.get('/users', userController.getAllUsers);
router.get('/user/:id', userController.getUserById);
router.put('/user/:id', userController.updateUserById);
router.delete('/user/:id', userController.deleteUserById);

module.exports = router;