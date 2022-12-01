const db = require("../database/connection");
const bcrypt = require('bcryptjs');

exports.pesquisar = async (req, res) =>{
    const {pesquisar} = req.body;

    db.query('SELECT postagens.post_id, post_data, post_titulo, post_conteudo, img_nome FROM postagens INNER JOIN imagens ON postagens.post_id = imagens.post_id WHERE post_titulo like ?;', '%' + [pesquisar] + '%', async (err, results) => {
    exports.pesquisa = results
    res.redirect('/pesquisa')
   
    })
  
}