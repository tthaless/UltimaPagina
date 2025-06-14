// --- Importações ---
const express = require('express');
const db = require('./dataBase');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// --- Configurações Iniciais ---
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.static('public'));

// --- Conexão com o Banco ---
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar com o banco de dados:', err);
    return;
  }
  console.log('Conectado com sucesso ao banco de dados MySQL!');
});

// --- Uso das Rotas ---
// Todas as rotas que começam com /api (ex: /api/login, /api/register) usarão o authRoutes
app.use('/api', authRoutes); 
// Todas as rotas que começam com /api/admin/categorias usarão o categoryRoutes
app.use('/api/admin/categorias', categoryRoutes);

// --- Inicia o Servidor ---
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});