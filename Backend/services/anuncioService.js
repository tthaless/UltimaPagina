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

exports.deleteMeuAnuncio = async (idAnuncio, user) => { // Agora recebe 'user' em vez de 'userId'
  // Se o usuário for um administrador, ele pode excluir qualquer anúncio
  if (user.tipo_usuario === 'admin') {
    const [result] = await anuncioPersistence.remove(idAnuncio);
    if (result.affectedRows === 0) {
      throw new Error('Anúncio não encontrado.'); // Mesmo para admin, o anúncio precisa existir
    }
    return { message: 'Anúncio excluído com sucesso!' }; // Retorna mensagem de sucesso para o admin
  }

  // Se não for um administrador, mantenha a checagem de propriedade
  // A função getAnuncioById já verifica se o anúncio pertence ao userId
  const anuncio = await exports.getAnuncioById(idAnuncio, user.id); 
  return anuncioPersistence.remove(idAnuncio);
};