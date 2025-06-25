const db = require('../dataBase');

// Função para CRIAR um novo anúncio
const createAnuncio = (req, res) => {
  // Pegamos os dados do corpo da requisição (que virão do formulário do frontend)
  const { titulo, descricao, categoria_id, bairro_id } = req.body;

  // Pegamos o ID do usuário que está fazendo a requisição.
  // Ele foi adicionado ao 'req' pelo nosso middleware 'authenticateToken'
  const usuario_id = req.user.id;

  // Validação simples
  if (!titulo || !descricao || !categoria_id || !bairro_id) {
    return res.status(400).send({ message: 'Todos os campos são obrigatórios.' });
  }

  const sql = "INSERT INTO anuncios (titulo, descricao, usuario_id, categoria_id, bairro_id) VALUES (?, ?, ?, ?, ?)";
  const values = [titulo, descricao, usuario_id, categoria_id, bairro_id];

  //verificar tamanho
  if (descricao && descricao.length > 500) {
    return res.status(400).send({ message: 'A descrição não pode ter mais de 500 caracteres.' });
  }

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Erro ao criar anúncio:", err);
      return res.status(500).send({ message: "Erro ao criar anúncio." });
    }
    res.status(201).send({ message: "Anúncio criado com sucesso!", anuncioId: result.insertId });
  });
};

// Função para BUSCAR todos os anúncios
const getAllAnuncios = (req, res) => {
  // Este comando SQL usa JOIN para juntar informações de 4 tabelas diferentes
  const sql = `
    SELECT 
      anuncios.id, 
      anuncios.titulo, 
      anuncios.descricao,
      usuarios.nome AS autor_nome,
      categorias.nome AS categoria_nome,
      bairros.nome AS bairro_nome,
      anuncios.data_publicacao
    FROM anuncios
    JOIN usuarios ON anuncios.usuario_id = usuarios.id
    JOIN categorias ON anuncios.categoria_id = categorias.id
    JOIN bairros ON anuncios.bairro_id = bairros.id
    WHERE anuncios.status = 'ativo'
    ORDER BY anuncios.data_publicacao DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar anúncios:", err);
      return res.status(500).send({ message: "Erro ao buscar anúncios." });
    }
    res.status(200).json(results);
  });
};

// Função para buscar apenas os anúncios do usuário logado
const getMeusAnuncios = (req, res) => {
  // O ID do usuário vem do token que foi validado pelo middleware authenticateToken
  const usuarioId = req.user.id;

  const sql = `
    SELECT 
      anuncios.id, 
      anuncios.titulo, 
      anuncios.descricao,
      categorias.nome AS categoria_nome,
      bairros.nome AS bairro_nome
    FROM anuncios
    JOIN categorias ON anuncios.categoria_id = categorias.id
    JOIN bairros ON anuncios.bairro_id = bairros.id
    WHERE anuncios.usuario_id = ? AND anuncios.status = 'ativo'
    ORDER BY anuncios.data_publicacao DESC
  `;

  db.query(sql, [usuarioId], (err, results) => {
    if (err) {
      console.error("Erro ao buscar meus anúncios:", err);
      return res.status(500).send({ message: "Erro ao buscar seus anúncios." });
    }
    res.status(200).json(results);
  });
};

// Função para EXCLUIR um anúncio próprio
const deleteMeuAnuncio = (req, res) => {
  const idAnuncioParaExcluir = req.params.id;
  const idUsuarioLogado = req.user.id; // ID do usuário que veio do token

  // Primeiro, buscamos o anúncio para garantir que ele pertence ao usuário logado
  const getAnuncioSql = "SELECT * FROM anuncios WHERE id = ?";
  db.query(getAnuncioSql, [idAnuncioParaExcluir], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).send({ message: "Anúncio não encontrado." });
    }

    const anuncio = results[0];

    // A VERIFICAÇÃO DE SEGURANÇA:
    if (anuncio.usuario_id !== idUsuarioLogado) {
      return res.status(403).send({ message: "Acesso negado. Você não pode excluir este anúncio." });
    }

    // Se a verificação passou, prosseguimos com a exclusão
    const deleteSql = "DELETE FROM anuncios WHERE id = ?";
    db.query(deleteSql, [idAnuncioParaExcluir], (deleteErr, deleteResult) => {
      if (deleteErr) return res.status(500).send({ message: 'Erro ao excluir o anúncio.' });

      res.status(200).send({ message: 'Anúncio excluído com sucesso!' });
    });
  });
};

// Função para BUSCAR UM anúncio específico pelo seu ID
const getAnuncioById = (req, res) => {
  const idAnuncio = req.params.id;
  const idUsuarioLogado = req.user.id;

  const sql = "SELECT * FROM anuncios WHERE id = ? AND usuario_id = ?";
  db.query(sql, [idAnuncio, idUsuarioLogado], (err, results) => {
    if (err) return res.status(500).send({ message: "Erro ao buscar o anúncio." });
    if (results.length === 0) return res.status(404).send({ message: "Anúncio não encontrado ou você não tem permissão para vê-lo." });

    res.status(200).json(results[0]);
  });
};

// Função para EDITAR um anúncio próprio
const updateMeuAnuncio = (req, res) => {
  const idAnuncioParaEditar = req.params.id;
  const idUsuarioLogado = req.user.id;
  const { titulo, descricao, categoria_id, bairro_id } = req.body;

  //verificacao tamanho
  if (descricao && descricao.length > 500) {
    return res.status(400).send({ message: 'A descrição não pode ter mais de 500 caracteres.' });
  }

  if (!titulo || !descricao || !categoria_id || !bairro_id) {
    return res.status(400).send({ message: 'Todos os campos são obrigatórios.' });
  }

  // A verificação de propriedade é feita no comando UPDATE com a cláusula WHERE
  const sql = "UPDATE anuncios SET titulo = ?, descricao = ?, categoria_id = ?, bairro_id = ? WHERE id = ? AND usuario_id = ?";
  db.query(sql, [titulo, descricao, categoria_id, bairro_id, idAnuncioParaEditar, idUsuarioLogado], (err, result) => {
    if (err) return res.status(500).send({ message: 'Erro ao editar o anúncio.' });
    if (result.affectedRows === 0) return res.status(404).send({ message: 'Anúncio não encontrado ou você não tem permissão para editá-lo.' });

    res.status(200).send({ message: 'Anúncio atualizado com sucesso!' });
  });
};

module.exports = {
  createAnuncio,
  getAllAnuncios,
  getMeusAnuncios, 
  deleteMeuAnuncio,
  getAnuncioById, 
  updateMeuAnuncio
};
