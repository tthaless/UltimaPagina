const express = require('express');
const router = express.Router();
const anuncioController = require('../controllers/anuncioController');
const { authenticateToken } = require('../middlewares/authMiddleware'); // Importando apenas o guarda de autenticação
// Rota para buscar todos os anúncios. Requer que o usuário esteja logado.
router.get('/', authenticateToken, anuncioController.getAllAnuncios);

// Rota para criar um novo anúncio. Requer apenas que o usuário esteja logado.
router.post('/', authenticateToken, anuncioController.createAnuncio);

// Rota para o usuário buscar seus próprios anúncios
router.get('/meus', authenticateToken, anuncioController.getMeusAnuncios);

// Rota para o usuário excluir um de seus próprios anúncios
router.delete('/:id', authenticateToken, anuncioController.deleteMeuAnuncio);

// Rota para buscar um anúncio específico pelo ID
router.get('/:id', authenticateToken, anuncioController.getAnuncioById);

// Rota para o usuário editar um de seus próprios anúncios
router.put('/:id', authenticateToken, anuncioController.updateMeuAnuncio);

// Rota para qualquer usuário logado buscar um anúncio específico pelo ID para visualização
router.get('/public/:id', authenticateToken, anuncioController.getPublicAnuncioDetails);

module.exports = router;