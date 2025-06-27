const favoritoPersistence = require('../persistence/favoritoPersistence');
const anuncioPersistence = require('../persistence/anuncioPersistence'); // Para verificar se o anúncio existe

// Função para adicionar/remover um anúncio dos favoritos
exports.toggleFavorite = async (usuario_id, anuncio_id) => {
  const [anuncios] = await anuncioPersistence.findById(anuncio_id);
  if (anuncios.length === 0) {
    throw new Error('Anúncio não encontrado.');
  }

  const [favoriteCheck] = await favoritoPersistence.check(usuario_id, anuncio_id);
  const isFavorite = favoriteCheck[0].isFavorite > 0;

  if (isFavorite) {
    await favoritoPersistence.remove(usuario_id, anuncio_id);
    return { message: 'Anúncio removido dos favoritos.', favorited: false };
  } else {
    await favoritoPersistence.add(usuario_id, anuncio_id);
    return { message: 'Anúncio adicionado aos favoritos!', favorited: true };
  }
};

exports.getFavorites = async (usuario_id) => {
  const [favoritos] = await favoritoPersistence.findByUserId(usuario_id);
  return favoritos;
};