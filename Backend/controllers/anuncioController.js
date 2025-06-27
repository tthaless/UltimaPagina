const anuncioService = require('../services/anuncioService');

const getAllAnuncios = async (req, res) => {
  try {
    const [anuncios] = await anuncioService.getAllAnuncios();
    res.status(200).json(anuncios);
  } catch (error) {
    res.status(500).send({ message: "Erro ao buscar anúncios." });
  }
};

const getMeusAnuncios = async (req, res) => {
  try {
    const [anuncios] = await anuncioService.getMeusAnuncios(req.user.id);
    res.status(200).json(anuncios);
  } catch (error) {
    res.status(500).send({ message: "Erro ao buscar seus anúncios." });
  }
};

const getAnuncioById = async (req, res) => {
  try {
    const anuncio = await anuncioService.getAnuncioById(req.params.id, req.user.id);
    res.status(200).json(anuncio);
  } catch (error) {
    res.status(error.message.includes('negado') ? 403 : 404).send({ message: error.message });
  }
};

const createAnuncio = async (req, res) => {
  try {
    const { titulo, descricao, categoria_id, bairro_id } = req.body;
    const result = await anuncioService.createAnuncio(titulo, descricao, req.user.id, categoria_id, bairro_id);
    res.status(201).send({ message: "Anúncio criado com sucesso!", anuncioId: result[0].insertId });
  } catch (error) {
    res.status(error.message.includes('obrigatórios') ? 400 : 500).send({ message: error.message });
  }
};

const updateMeuAnuncio = async (req, res) => {
  try {
    await anuncioService.updateMeuAnuncio(req.params.id, req.user.id, req.body);
    res.status(200).send({ message: 'Anúncio atualizado com sucesso!' });
  } catch (error) {
    res.status(error.message.includes('negado') || error.message.includes('encontrado') ? 403 : 400).send({ message: error.message });
  }
};

const deleteMeuAnuncio = async (req, res) => {
  try {
    await anuncioService.deleteMeuAnuncio(req.params.id, req.user); // Passa o objeto 'req.user' completo
    res.status(200).send({ message: 'Anúncio excluído com sucesso!' });
  } catch (error) {
    // Mantém a lógica de erro. 'negado' será para usuários não-admin tentando excluir de outros.
    res.status(error.message.includes('negado') || error.message.includes('encontrado') ? 403 : 404).send({ message: error.message });
  }
};

module.exports = {
  getAllAnuncios,
  getMeusAnuncios,
  getAnuncioById,
  createAnuncio,
  updateMeuAnuncio,
  deleteMeuAnuncio
};