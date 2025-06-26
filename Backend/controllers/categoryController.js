const categoryService = require('../services/categoryService');

const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).send({ message: "Erro ao buscar categorias." });
  }
};

const getPublicCategories = async (req, res) => {
  try {
    const [categories] = await categoryService.getPublicCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).send({ message: "Erro ao buscar categorias." });
  }
};

const createCategory = async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    const result = await categoryService.createCategory(nome, descricao);
    res.status(201).send(result);
  } catch (error) {
    // Erros de negócio (ex: nome duplicado) ou de sistema
    res.status(error.message.includes('obrigatório') || error.message.includes('existe') ? 400 : 500).send({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await categoryService.deleteCategory(id);
    res.status(200).send(result);
  } catch (error) {
    res.status(error.message.includes('em uso') || error.message.includes('encontrada') ? 400 : 500).send({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao } = req.body;
    const result = await categoryService.updateCategory(id, nome, descricao);
    res.status(200).send(result);
  } catch (error) {
    res.status(error.message.includes('obrigatório') || error.message.includes('existe') || error.message.includes('encontrada') ? 400 : 500).send({ message: error.message });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  deleteCategory,
  updateCategory,
  getPublicCategories
};