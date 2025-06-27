// --- Importações ---
const express = require('express');
const db = require('./dataBase');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const anuncioRoutes = require('./routes/anuncioRoutes');
const bairroRoutes = require('./routes/bairroRoutes');
const favoritoRoutes = require('./routes/favoritoRoutes');
const path = require('path');

// --- Configurações Iniciais ---
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));
app.use('/api/bairros', bairroRoutes);

// --- Conexão com o Banco ---
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar com o banco de dados:', err);
    return;
  }
  console.log('Conectado com sucesso ao banco de dados MySQL!');
});

// --- Uso das Rotas ---
app.use('/api', authRoutes); 
app.use('/api/admin/categorias', categoryRoutes);
app.use('/api/anuncios', anuncioRoutes);
app.use('/api/bairros', bairroRoutes);
app.use('/api', favoritoRoutes);

// --- Inicia o Servidor ---
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});