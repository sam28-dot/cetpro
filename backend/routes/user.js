// routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { profileUpdateValidator } = require('../middleware/validation');

router.use(protect); // All user routes require auth

router.get('/profile', userController.getProfile);
router.patch('/profile', profileUpdateValidator, userController.updateProfile);
router.patch('/change-password', userController.changePassword);
router.get('/stats', userController.getStats);

module.exports = router;
