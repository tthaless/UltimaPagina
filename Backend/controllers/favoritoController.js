const favoritoService = require('../services/favoritoService');

const toggleFavorite = async (req, res) => {
  try {
    const anuncioId = req.params.id;
    const usuarioId = req.user.id;

    const result = await favoritoService.toggleFavorite(usuarioId, anuncioId);
    res.status(200).send(result);
  } catch (error) {
    console.error('Erro ao alternar favorito:', error);
    res.status(error.message.includes('Anúncio não encontrado') ? 404 : 500).send({ message: error.message });
  }
};

const getFavorites = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const favorites = await favoritoService.getFavorites(usuarioId);
    res.status(200).json(favorites);
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error);
    res.status(500).send({ message: "Erro ao buscar seus anúncios favoritos." });
  }
};

module.exports = {
  toggleFavorite,
  getFavorites
};