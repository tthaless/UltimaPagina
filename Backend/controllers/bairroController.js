const db = require('../dataBase');

const getAllBairros = (req, res) => {
  const sql = "SELECT id, nome FROM bairros";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send({ message: "Erro ao buscar bairros." });
    res.status(200).json(results);
  });
};

module.exports = {
  getAllBairros
};