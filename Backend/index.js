// --- Importações ---
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// --- Configurações Iniciais ---
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.static('public'));

// --- Configuração da Conexão com o Banco de Dados ---
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ultima_pagina'
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar com o banco de dados:', err);
    return;
  }
  console.log('Conectado com sucesso ao banco de dados MySQL!');
});

// --- Middlewares de Segurança (Nossos "Guardas") ---

// Guarda 1: Verifica se o usuário tem um "crachá" (token) válido
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401); // Não autorizado
  }

  jwt.verify(token, 'ultima_pagina_super_secreta_123', (err, user) => {
    if (err) {
      return res.sendStatus(403); // Proibido (token inválido)
    }
    req.user = user;
    next();
  });
}

// Guarda 2: Verifica se o "crachá" é do tipo 'admin'
function isAdmin(req, res, next) {
  if (req.user.tipo_usuario !== 'admin') {
    return res.status(403).send({ message: "Acesso negado. Rota exclusiva para administradores." });
  }
  next();
}

// --- Nossas Rotas (Endpoints) ---

// Rota de teste
app.get('/', (req, res) => {
  res.send('Olá, Última Página! Nosso servidor está funcionando.');
});

// Rota para CADASTRAR um novo usuário (ATUALIZADA SEM CPF)
app.post('/api/register', async (req, res) => {
  try {
    // 1. Pega os dados (sem o cpf)
    const { nome, email, senha, telefone, tipo_usuario } = req.body;

    // 2. Criptografa a senha (continua igual)
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // 3. Cria o comando SQL (sem o cpf)
    const sql = "INSERT INTO usuarios (nome, email, senha, telefone, tipo_usuario) VALUES (?, ?, ?, ?, ?)";
    const values = [nome, email, senhaHash, telefone, tipo_usuario];

    // 4. Executa o comando SQL (continua igual)
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Erro ao cadastrar usuário:", err);
        return res.status(500).send({ message: "Erro ao cadastrar usuário.", error: err });
      }

      // 5. Se tudo deu certo, envia uma resposta de sucesso (continua igual)
      console.log("Usuário cadastrado com sucesso:", result.insertId);
      res.status(201).send({ message: "Usuário cadastrado com sucesso!", userId: result.insertId });
    });

  } catch (error) {
    console.error("Erro no servidor:", error);
    res.status(500).send({ message: "Ocorreu um erro inesperado no servidor." });
  }
});

// Rota para LOGAR um usuário
app.post('/api/login', (req, res) => {
  try {
    const { email, senha } = req.body;
    const sql = "SELECT * FROM usuarios WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
      if (err || results.length === 0) {
        return res.status(401).send({ message: "E-mail ou senha inválidos." });
      }
      const usuario = results[0];
      const senhaCorresponde = await bcrypt.compare(senha, usuario.senha);
      if (!senhaCorresponde) {
        return res.status(401).send({ message: "E-mail ou senha inválidos." });
      }

      const payload = { id: usuario.id, tipo_usuario: usuario.tipo_usuario };
      const chaveSecreta = 'ultima_pagina_super_secreta_123';
      const token = jwt.sign(payload, chaveSecreta, { expiresIn: '1h' });
      
      res.status(200).send({ 
         message: "Login bem-sucedido!", 
         token: token,
        usuario: {
        nome: usuario.nome,
         tipo_usuario: usuario.tipo_usuario
  } 
});
    });
  } catch (error) {
    res.status(500).send({ message: "Ocorreu um erro inesperado no servidor." });
  }
});

// --- ROTAS DO ADMIN PARA CATEGORIAS ---

// Rota para BUSCAR todas as categorias (protegida para admins)
app.get('/api/admin/categorias', authenticateToken, isAdmin, (req, res) => {
  const sql = "SELECT * FROM categorias";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send({ message: "Erro ao buscar categorias." });
    }
    res.status(200).json(results);
  });
});

// Rota para CRIAR uma nova categoria (protegida para admins)
app.post('/api/admin/categorias', authenticateToken, isAdmin, (req, res) => {
  const { nome, descricao } = req.body;

  if (!nome) {
    return res.status(400).send({ message: 'O nome da categoria é obrigatório.' });
  }

  const sql = "INSERT INTO categorias (nome, descricao) VALUES (?, ?)";
  db.query(sql, [nome, descricao], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).send({ message: 'Uma categoria com este nome já existe.' });
      }
      return res.status(500).send({ message: 'Erro ao criar a categoria.' });
    }
    res.status(201).send({ message: 'Categoria criada com sucesso!', id: result.insertId });
  });
});

// Rota para EXCLUIR uma categoria (protegida para admins)
app.delete('/api/admin/categorias/:id', authenticateToken, isAdmin, (req, res) => {
  const idParaExcluir = req.params.id;

  const checkSql = "SELECT COUNT(*) AS total FROM anuncios WHERE categoria_id = ?";
  db.query(checkSql, [idParaExcluir], (err, results) => {
    if (err) return res.status(500).send({ message: 'Erro ao verificar anúncios.' });
    if (results[0].total > 0) {
      return res.status(409).send({ message: 'Esta categoria está em uso e não pode ser excluída.' });
    }

    const deleteSql = "DELETE FROM categorias WHERE id = ?";
    db.query(deleteSql, [idParaExcluir], (deleteErr, deleteResult) => {
      if (deleteErr) return res.status(500).send({ message: 'Erro ao excluir a categoria.' });
      if (deleteResult.affectedRows === 0) return res.status(404).send({ message: 'Categoria não encontrada.' });

      res.status(200).send({ message: 'Categoria excluída com sucesso!' });
    });
  });
});

// Rota para EDITAR (Update) uma categoria (protegida para admins)
app.put('/api/admin/categorias/:id', authenticateToken, isAdmin, (req, res) => {
  const idParaEditar = req.params.id;
  const { nome, descricao } = req.body;

  // Validação simples
  if (!nome) {
    return res.status(400).send({ message: 'O nome da categoria é obrigatório.' });
  }

  const sql = "UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?";
  db.query(sql, [nome, descricao, idParaEditar], (err, result) => {
    if (err) {
      // Trata erro de nome duplicado
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).send({ message: 'Já existe uma categoria com este nome.' });
      }
      return res.status(500).send({ message: 'Erro ao editar a categoria.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Categoria não encontrada.' });
    }
    res.status(200).send({ message: 'Categoria atualizada com sucesso!' });
  });
});

// --- Inicia o Servidor ---
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});