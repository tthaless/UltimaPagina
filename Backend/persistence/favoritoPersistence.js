const db = require('../dataBase');

// Adiciona um anúncio aos favoritos de um usuário
exports.add = (usuario_id, anuncio_id) => {
  const sql = "INSERT INTO favoritos (usuario_id, anuncio_id) VALUES (?, ?)";
  return db.promise().query(sql, [usuario_id, anuncio_id]);
};

// Remove um anúncio dos favoritos de um usuário
exports.remove = (usuario_id, anuncio_id) => {
  const sql = "DELETE FROM favoritos WHERE usuario_id = ? AND anuncio_id = ?";
  return db.promise().query(sql, [usuario_id, anuncio_id]);
};

// Verifica se um anúncio específico é favorito de um usuário
exports.check = (usuario_id, anuncio_id) => {
  const sql = "SELECT COUNT(*) AS isFavorite FROM favoritos WHERE usuario_id = ? AND anuncio_id = ?";
  return db.promise().query(sql, [usuario_id, anuncio_id]);
};

// Busca todos os anúncios favoritados por um usuário
exports.findByUserId = (usuario_id) => {
  const sql = `
    SELECT
      a.id,
      a.titulo,
      a.descricao,
      u.nome AS autor_nome,
      c.nome AS categoria_nome,
      b.nome AS bairro_nome,
      a.data_publicacao
    FROM favoritos f
    JOIN anuncios a ON f.anuncio_id = a.id
    JOIN usuarios u ON a.usuario_id = u.id
    JOIN categorias c ON a.categoria_id = c.id
    JOIN bairros b ON a.bairro_id = b.id
    WHERE f.usuario_id = ?
    ORDER BY a.data_publicacao DESC
  `;
  return db.promise().query(sql, [usuario_id]);
};