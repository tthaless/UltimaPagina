const anuncioService = require('../services/anuncioService');

const getAllAnuncios = async (req, res) => {
  try {
    const categoryId = req.query.categoria_id;
    const bairroId = req.query.bairro_id;

    const [anuncios] = await anuncioService.getAllAnuncios(categoryId, bairroId);
    res.status(200).json(anuncios);
  } catch (error) {
    console.error('Erro ao buscar anúncios com filtro:', error);
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
    const { titulo, descricao, descricao_completa, contato_telefone, categoria_id, bairro_id } = req.body;
    const result = await anuncioService.createAnuncio(titulo, descricao, descricao_completa, contato_telefone, req.user.id, categoria_id, bairro_id);
    res.status(201).send({ message: "Anúncio criado com sucesso!", anuncioId: result[0].insertId });
  } catch (error) {
    console.error('Erro ao criar anúncio:', error);
    res.status(error.message.includes('obrigatórios') ? 400 : 500).send({ message: error.message });
  }
};

const updateMeuAnuncio = async (req, res) => {
  try {
    await anuncioService.updateMeuAnuncio(req.params.id, req.user.id, req.body); 
    res.status(200).send({ message: 'Anúncio atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar anúncio:', error);
    res.status(error.message.includes('negado') || error.message.includes('encontrado') ? 403 : 400).send({ message: error.message });
  }
};

const deleteMeuAnuncio = async (req, res) => {
  try {
    await anuncioService.deleteMeuAnuncio(req.params.id, req.user);
    res.status(200).send({ message: 'Anúncio excluído com sucesso!' });
  } catch (error) {
    res.status(error.message.includes('negado') || error.message.includes('encontrado') ? 403 : 404).send({ message: error.message });
  }
};

const getPublicAnuncioDetails = async (req, res) => {
  try {
    const anuncio = await anuncioService.getAnuncioPublicDetails(req.params.id);
    res.status(200).json(anuncio);
  } catch (error) {
    console.error('Erro ao buscar detalhes públicos do anúncio:', error);
    res.status(error.message.includes('encontrado') ? 404 : 500).send({ message: error.message });
  }
};

module.exports = {
  getAllAnuncios,
  getMeusAnuncios,
  getAnuncioById,
  createAnuncio,
  updateMeuAnuncio,
  deleteMeuAnuncio,
  getPublicAnuncioDetails
};