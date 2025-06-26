const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, isAdmin, categoryController.getAllCategories);
router.post('/', authenticateToken, isAdmin, categoryController.createCategory);
router.delete('/:id', authenticateToken, isAdmin, categoryController.deleteCategory);
router.put('/:id', authenticateToken, isAdmin, categoryController.updateCategory); 
router.get('/public', authenticateToken, categoryController.getPublicCategories);

module.exports = router;