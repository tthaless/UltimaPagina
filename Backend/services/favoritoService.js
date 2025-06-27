const favoritoPersistence = require('../persistence/favoritoPersistence');
const anuncioPersistence = require('../persistence/anuncioPersistence'); // Para verificar se o anúncio existe

// Função para adicionar/remover um anúncio dos favoritos
exports.toggleFavorite = async (usuario_id, anuncio_id) => {
  // Primeiro, verifica se o anúncio existe
  const [anuncios] = await anuncioPersistence.findById(anuncio_id);
  if (anuncios.length === 0) {
    throw new Error('Anúncio não encontrado.');
  }

  // Verifica se o anúncio já está nos favoritos do usuário
  const [favoriteCheck] = await favoritoPersistence.check(usuario_id, anuncio_id);
  const isFavorite = favoriteCheck[0].isFavorite > 0;

  if (isFavorite) {
    // Se já é favorito, remove
    await favoritoPersistence.remove(usuario_id, anuncio_id);
    return { message: 'Anúncio removido dos favoritos.', favorited: false };
  } else {
    // Se não é favorito, adiciona
    await favoritoPersistence.add(usuario_id, anuncio_id);
    return { message: 'Anúncio adicionado aos favoritos!', favorited: true };
  }
};

// Função para buscar todos os anúncios favoritos de um usuário
exports.getFavorites = async (usuario_id) => {
  const [favoritos] = await favoritoPersistence.findByUserId(usuario_id);
  return favoritos;
};