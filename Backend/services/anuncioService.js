const anuncioPersistence = require('../persistence/anuncioPersistence');

exports.getAllAnuncios = (categoryId, bairroId) => {
  return anuncioPersistence.findAll(categoryId, bairroId);
};

exports.getMeusAnuncios = (userId) => {
  return anuncioPersistence.findMyAds(userId);
};

exports.getAnuncioById = async (id, userId) => {
  const [anuncios] = await anuncioPersistence.findById(id);
  if (anuncios.length === 0) {
    throw new Error('Anúncio não encontrado.');
  }
  const anuncio = anuncios[0];
  // Regra de negócio: garante que o usuário só pode ver detalhes do seu próprio anúncio (para edição)
  if (anuncio.usuario_id !== userId) {
    throw new Error('Acesso negado.');
  }
  return anuncio;
};

exports.createAnuncio = (titulo, descricao, descricao_completa, contato_telefone, usuario_id, categoria_id, bairro_id) => {
  if (!titulo || !descricao || !categoria_id || !bairro_id) {
    throw new Error('Os campos Título, Descrição, Categoria e Bairro são obrigatórios.');
  }
  return anuncioPersistence.create(titulo, descricao, descricao_completa, contato_telefone, usuario_id, categoria_id, bairro_id);
};

exports.updateMeuAnuncio = async (idAnuncio, userId, dadosAnuncio) => {
  const anuncio = await exports.getAnuncioById(idAnuncio, userId);

  const { titulo, descricao, descricao_completa, contato_telefone, categoria_id, bairro_id } = dadosAnuncio;
  if (!titulo || !descricao || !categoria_id || !bairro_id) {
    throw new Error('Os campos Título, Descrição, Categoria e Bairro são obrigatórios.');
  }

  return anuncioPersistence.update(idAnuncio, titulo, descricao, descricao_completa, contato_telefone, categoria_id, bairro_id);
};

exports.deleteMeuAnuncio = async (idAnuncio, user) => {
  // Se o usuário for um administrador, ele pode excluir qualquer anúncio
  if (user.tipo_usuario === 'admin') {
    const [result] = await anuncioPersistence.remove(idAnuncio);
    if (result.affectedRows === 0) {
      throw new Error('Anúncio não encontrado.');
    }
    return { message: 'Anúncio excluído com sucesso!' };
  }


  const anuncio = await exports.getAnuncioById(idAnuncio, user.id); 
  return anuncioPersistence.remove(idAnuncio);
};

exports.getAnuncioPublicDetails = async (id) => {
  const [anuncios] = await anuncioPersistence.findById(id);
  if (anuncios.length === 0) {
    throw new Error('Anúncio não encontrado.');
  }
  return anuncios[0];
};