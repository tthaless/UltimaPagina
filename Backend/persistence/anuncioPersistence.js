const db = require('../dataBase');

exports.findAll = (categoryId, bairroId) => { // Adicionados parâmetros opcionais
  let sql = `
    SELECT a.id, a.titulo, a.descricao, u.nome AS autor_nome, c.nome AS categoria_nome, b.nome AS bairro_nome, a.data_publicacao
    FROM anuncios AS a
    JOIN usuarios AS u ON a.usuario_id = u.id
    JOIN categorias AS c ON a.categoria_id = c.id
    JOIN bairros AS b ON a.bairro_id = b.id
    WHERE a.status = 'ativo'
  `;
  const params = []; // Array para os parâmetros da query

  if (categoryId) {
    sql += ` AND a.categoria_id = ?`;
    params.push(categoryId);
  }
  if (bairroId) {
    sql += ` AND a.bairro_id = ?`;
    params.push(bairroId);
  }

  sql += ` ORDER BY a.data_publicacao DESC`;

  return db.promise().query(sql, params); // Passa os parâmetros para a query
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
  const sql = `
    SELECT
        a.id,
        a.titulo,
        a.descricao,
        a.descricao_completa,
        a.contato_telefone,
        a.data_publicacao,
        u.nome AS autor_nome,      -- Nome do autor
        c.nome AS categoria_nome,  -- Nome da categoria
        b.nome AS bairro_nome,     -- Nome do bairro
        a.usuario_id,              -- Mantém o ID do usuário para checagens futuras
        a.categoria_id,            -- Mantém o ID da categoria
        a.bairro_id                -- Mantém o ID do bairro
    FROM anuncios AS a
    JOIN usuarios AS u ON a.usuario_id = u.id
    JOIN categorias AS c ON a.categoria_id = c.id
    JOIN bairros AS b ON a.bairro_id = b.id
    WHERE a.id = ? AND a.status = 'ativo'
  `;
  return db.promise().query(sql, [id]);
};

exports.create = (titulo, descricao, descricao_completa, contato_telefone, usuario_id, categoria_id, bairro_id) => {
  const sql = "INSERT INTO anuncios (titulo, descricao, descricao_completa, contato_telefone, usuario_id, categoria_id, bairro_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
  return db.promise().query(sql, [titulo, descricao, descricao_completa, contato_telefone, usuario_id, categoria_id, bairro_id]);
};

exports.update = (id, titulo, descricao, descricao_completa, contato_telefone, categoria_id, bairro_id) => {
  const sql = "UPDATE anuncios SET titulo = ?, descricao = ?, descricao_completa = ?, contato_telefone = ?, categoria_id = ?, bairro_id = ? WHERE id = ?";
  return db.promise().query(sql, [titulo, descricao, descricao_completa, contato_telefone, categoria_id, bairro_id, id]);
};

exports.remove = (id) => {
  const sql = "DELETE FROM anuncios WHERE id = ?";
  return db.promise().query(sql, [id]);
};