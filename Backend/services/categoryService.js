const categoryPersistence = require('../persistence/categoryPersistence');

exports.getAllCategories = async () => {
  const [categories] = await categoryPersistence.findAll();
  return categories;
};

exports.getPublicCategories = () => {
  return categoryPersistence.findAll();
};

exports.createCategory = async (nome, descricao) => {
  if (!nome) {
    throw new Error('O nome da categoria é obrigatório.');
  }
  try {
    const [result] = await categoryPersistence.create(nome, descricao);
    return { message: 'Categoria criada com sucesso!', id: result.insertId };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Uma categoria com este nome já existe.');
    }
    throw error; // Lança outros erros
  }
};

exports.deleteCategory = async (id) => {
  const [anuncios] = await categoryPersistence.countAnunciosByCategoriaId(id);
  if (anuncios[0].total > 0) {
    throw new Error('Esta categoria está em uso e não pode ser excluída.');
  }

  const [result] = await categoryPersistence.remove(id);
  if (result.affectedRows === 0) {
    throw new Error('Categoria não encontrada.');
  }
  return { message: 'Categoria excluída com sucesso!' };
};

exports.updateCategory = async (id, nome, descricao) => {
  if (!nome) {
    throw new Error('O nome da categoria é obrigatório.');
  }
  try {
    const [result] = await categoryPersistence.update(id, nome, descricao);
    if (result.affectedRows === 0) {
      throw new Error('Categoria não encontrada.');
    }
    return { message: 'Categoria atualizada com sucesso!' };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Já existe uma categoria com este nome.');
    }
    throw error;
  }
};