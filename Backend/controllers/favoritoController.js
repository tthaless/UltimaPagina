const favoritoService = require('../services/favoritoService');

// Controlador para adicionar/remover um anúncio dos favoritos
const toggleFavorite = async (req, res) => {
  try {
    const anuncioId = req.params.id; // ID do anúncio vem da URL
    const usuarioId = req.user.id; // ID do usuário vem do token JWT

    const result = await favoritoService.toggleFavorite(usuarioId, anuncioId);
    res.status(200).send(result); // Envia a mensagem e o status (favorited/unfavorited)
  } catch (error) {
    console.error('Erro ao alternar favorito:', error);
    // Erros como "Anúncio não encontrado" ou outros erros de serviço
    res.status(error.message.includes('Anúncio não encontrado') ? 404 : 500).send({ message: error.message });
  }
};

// Controlador para buscar todos os anúncios favoritos do usuário logado
const getFavorites = async (req, res) => {
  try {
    const usuarioId = req.user.id; // ID do usuário vem do token JWT
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