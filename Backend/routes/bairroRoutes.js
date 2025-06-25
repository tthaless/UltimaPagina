const express = require('express');
const router = express.Router();
const bairroController = require('../controllers/bairroController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Rota para qualquer usuário logado buscar os bairros
router.get('/', authenticateToken, bairroController.getAllBairros);

module.exports = router;