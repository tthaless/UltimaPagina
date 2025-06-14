const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'ultima_pagina_super_secreta_123', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.user.tipo_usuario !== 'admin') {
    return res.status(403).send({ message: "Acesso negado." });
  }
  next();
}

module.exports = { authenticateToken, isAdmin };