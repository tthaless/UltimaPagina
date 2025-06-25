const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

// Define as rotas e qual função do controller cada uma chama
router.get('/', authenticateToken, isAdmin, categoryController.getAllCategories);
router.post('/', authenticateToken, isAdmin, categoryController.createCategory);
router.delete('/:id', authenticateToken, isAdmin, categoryController.deleteCategory);
router.put('/:id', authenticateToken, isAdmin, categoryController.updateCategory); 
// Rota pública para qualquer usuário logado buscar as categorias
router.get('/public', authenticateToken, categoryController.getPublicCategories);

module.exports = router;