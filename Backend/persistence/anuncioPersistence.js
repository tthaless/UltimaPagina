const db = require('../dataBase');

exports.findAll = () => {
  const sql = `
    SELECT a.id, a.titulo, a.descricao, u.nome AS autor_nome, c.nome AS categoria_nome, b.nome AS bairro_nome, a.data_publicacao
    FROM anuncios AS a
    JOIN usuarios AS u ON a.usuario_id = u.id
    JOIN categorias AS c ON a.categoria_id = c.id
    JOIN bairros AS b ON a.bairro_id = b.id
    WHERE a.status = 'ativo'
    ORDER BY a.data_publicacao DESC
  `;
  return db.promise().query(sql);
};

exports.findMyAds = (userId) => {
  const sql = `
    SELECT a.id, a.titulo, a.descricao, c.nome AS categoria_nome, b.nome AS bairro_nome
    FROM anuncios AS a
    JOIN categorias AS c ON a.categoria_id = c.id
    JOIN bairros AS b ON a.bairro_id = b.id
    WHERE a.usuario_id = ? AND a.status = 'ativo'
    ORDER BY a.data_publicacao DESC
  `;
  return db.promise().query(sql, [userId]);
};

exports.findById = (id) => {
  return db.promise().query("SELECT * FROM anuncios WHERE id = ?", [id]);
};

exports.create = (titulo, descricao, usuario_id, categoria_id, bairro_id) => {
  const sql = "INSERT INTO anuncios (titulo, descricao, usuario_id, categoria_id, bairro_id) VALUES (?, ?, ?, ?, ?)";
  return db.promise().query(sql, [titulo, descricao, usuario_id, categoria_id, bairro_id]);
};

exports.update = (id, titulo, descricao, categoria_id, bairro_id) => {
  const sql = "UPDATE anuncios SET titulo = ?, descricao = ?, categoria_id = ?, bairro_id = ? WHERE id = ?";
  return db.promise().query(sql, [titulo, descricao, categoria_id, bairro_id, id]);
};

exports.remove = (id) => {
  const sql = "DELETE FROM anuncios WHERE id = ?";
  return db.promise().query(sql, [id]);
};