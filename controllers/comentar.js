const db = require("../database/connection");
const bcrypt = require('bcryptjs');
const { post_id } = require("../routes/pages");

exports.comentar = async (req, res) =>{
    const {coment} = req.body
    db.query('INSERT INTO comentarios (use_id, coment_texto, post_id, coment_pre_resposta, coment_status, coment_moderacao) VALUES (5,?,?,?,1,1)',[coment,'', post_id],  async (err, results) => {
        console.log(err)
        console.log(post_id)
        res.render('noticia', {message:'Deu bom'})   
    })
}