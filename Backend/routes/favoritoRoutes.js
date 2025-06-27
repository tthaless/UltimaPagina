const express = require('express');
const router = express.Router();
const favoritoController = require('../controllers/favoritoController');
const { authenticateToken } = require('../middlewares/authMiddleware'); // Certifique-se de importar o middleware

// Rota para alternar (adicionar/remover) um anúncio dos favoritos
router.post('/anuncios/:id/favorite', authenticateToken, favoritoController.toggleFavorite);

// Rota para buscar todos os anúncios favoritos do usuário logado
router.get('/favoritos', authenticateToken, favoritoController.getFavorites);

module.exports = router;