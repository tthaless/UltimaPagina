const db = require('../dataBase');

exports.findAll = () => {
  return db.promise().query('SELECT * FROM categorias');
};

exports.create = (nome, descricao) => {
  const sql = "INSERT INTO categorias (nome, descricao) VALUES (?, ?)";
  return db.promise().query(sql, [nome, descricao]);
};

exports.update = (id, nome, descricao) => {
  const sql = "UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?";
  return db.promise().query(sql, [nome, descricao, id]);
};

exports.remove = (id) => {
  const sql = "DELETE FROM categorias WHERE id = ?";
  return db.promise().query(sql, [id]);
};

exports.countAnunciosByCategoriaId = (id) => {
  const sql = "SELECT COUNT(*) AS total FROM anuncios WHERE categoria_id = ?";
  return db.promise().query(sql, [id]);
};