const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota para registrar um novo usuário
router.post('/register', authController.registerUser);

// Rota para logar um usuário
router.post('/login', authController.loginUser);

module.exports = router;