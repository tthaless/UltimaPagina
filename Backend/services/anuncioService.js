const anuncioPersistence = require('../persistence/anuncioPersistence');

exports.getAllAnuncios = () => {
  return anuncioPersistence.findAll();
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

exports.createAnuncio = (titulo, descricao, usuario_id, categoria_id, bairro_id) => {
  if (!titulo || !descricao || !categoria_id || !bairro_id) {
    throw new Error('Todos os campos são obrigatórios.');
  }
  return anuncioPersistence.create(titulo, descricao, usuario_id, categoria_id, bairro_id);
};

exports.updateMeuAnuncio = async (idAnuncio, userId, dadosAnuncio) => {
  const anuncio = await exports.getAnuncioById(idAnuncio, userId); // Reutiliza a função que já tem a checagem de propriedade

  const { titulo, descricao, categoria_id, bairro_id } = dadosAnuncio;
  if (!titulo || !descricao || !categoria_id || !bairro_id) {
    throw new Error('Todos os campos são obrigatórios.');
  }

  return anuncioPersistence.update(idAnuncio, titulo, descricao, categoria_id, bairro_id);
};

exports.deleteMeuAnuncio = async (idAnuncio, userId) => {
  const anuncio = await exports.getAnuncioById(idAnuncio, userId); // Reutiliza a função que já tem a checagem de propriedade
  return anuncioPersistence.remove(idAnuncio);
};