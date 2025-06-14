const db = require('../dataBase'); // Verifique se o nome do seu arquivo é 'dataBase' ou 'database'

const getAllCategories = (req, res) => {
  const sql = "SELECT * FROM categorias";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send({ message: "Erro ao buscar categorias." });
    res.status(200).json(results);
  });
};

const createCategory = (req, res) => {
  const { nome, descricao } = req.body;
  if (!nome) return res.status(400).send({ message: 'O nome da categoria é obrigatório.' });

  const sql = "INSERT INTO categorias (nome, descricao) VALUES (?, ?)";
  db.query(sql, [nome, descricao], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).send({ message: 'Uma categoria com este nome já existe.' });
      return res.status(500).send({ message: 'Erro ao criar a categoria.' });
    }
    res.status(201).send({ message: 'Categoria criada com sucesso!', id: result.insertId });
  });
};

const deleteCategory = (req, res) => {
  const idParaExcluir = req.params.id;
  const checkSql = "SELECT COUNT(*) AS total FROM anuncios WHERE categoria_id = ?";
  db.query(checkSql, [idParaExcluir], (err, results) => {
    if (err) return res.status(500).send({ message: 'Erro ao verificar anúncios.' });
    if (results[0].total > 0) return res.status(409).send({ message: 'Esta categoria está em uso e não pode ser excluída.' });

    const deleteSql = "DELETE FROM categorias WHERE id = ?";
    db.query(deleteSql, [idParaExcluir], (deleteErr, deleteResult) => {
      if (deleteErr) return res.status(500).send({ message: 'Erro ao excluir a categoria.' });
      if (deleteResult.affectedRows === 0) return res.status(404).send({ message: 'Categoria não encontrada.' });
      res.status(200).send({ message: 'Categoria excluída com sucesso!' });
    });
  });
};

const updateCategory = (req, res) => {
  const idParaEditar = req.params.id;
  const { nome, descricao } = req.body;

  // Validação simples
  if (!nome) {
    return res.status(400).send({ message: 'O nome da categoria é obrigatório.' });
  }

  const sql = "UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?";
  db.query(sql, [nome, descricao, idParaEditar], (err, result) => {
    if (err) {
      // Trata erro de nome duplicado
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).send({ message: 'Já existe uma categoria com este nome.' });
      }
      return res.status(500).send({ message: 'Erro ao editar a categoria.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Categoria não encontrada.' });
    }
    res.status(200).send({ message: 'Categoria atualizada com sucesso!' });
  });
};

// A linha mais importante: exportando as funções corretas
module.exports = {
  getAllCategories,
  createCategory,
  deleteCategory,
  updateCategory
};