const db = require('../dataBase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  try {
    const { nome, email, senha, telefone, tipo_usuario } = req.body;
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);
    const sql = "INSERT INTO usuarios (nome, email, senha, telefone, tipo_usuario) VALUES (?, ?, ?, ?, ?)";
    const values = [nome, email, senhaHash, telefone, tipo_usuario];
    db.query(sql, values, (err, result) => {
      if (err) return res.status(500).send({ message: "Erro ao cadastrar usuário.", error: err });
      res.status(201).send({ message: "Usuário cadastrado com sucesso!", userId: result.insertId });
    });
  } catch (error) {
    res.status(500).send({ message: "Ocorreu um erro inesperado no servidor." });
  }
};

const loginUser = (req, res) => {
  try {
    const { email, senha } = req.body;
    const sql = "SELECT * FROM usuarios WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
      if (err || results.length === 0) return res.status(401).send({ message: "E-mail ou senha inválidos." });
      const usuario = results[0];
      const senhaCorresponde = await bcrypt.compare(senha, usuario.senha);
      if (!senhaCorresponde) return res.status(401).send({ message: "E-mail ou senha inválidos." });

      const payload = { id: usuario.id, tipo_usuario: usuario.tipo_usuario };
      const chaveSecreta = 'ultima_pagina_super_secreta_123';
      const token = jwt.sign(payload, chaveSecreta, { expiresIn: '1h' });

      res.status(200).send({ 
        message: "Login bem-sucedido!", 
        token: token,
        usuario: { nome: usuario.nome, tipo_usuario: usuario.tipo_usuario } 
      });
    });
  } catch (error) {
    res.status(500).send({ message: "Ocorreu um erro inesperado no servidor." });
  }
};

module.exports = { registerUser, loginUser };