const express = require('express')
const router = express.Router()
const login = require('../controllers/login')
const { route, post } = require('./routes')
const db = require("../database/connection");
const update = require('../controllers/update')
const pesquisar = require('../controllers/pesquisar');
const e = require('express');
const path = require('path')


//VISAO USUARIO

router.get('/', (req, res) =>{
    res.render("home", {aviso: update.aviso})
})

router.get("/cadastrar", (req, res) => {
    res.render("cadastrar")
})

router.get("/login", (req, res) => {
    res.render("login")
})

router.get("/feed",(req, res) => {

    db.query('SELECT postagens.post_id, post_data, post_titulo, post_conteudo, img_nome FROM postagens INNER JOIN imagens ON postagens.post_id = imagens.post_id WHERE post_destaque = 1 AND post_ativo = 1', async (err, results) => {
        exports.fixado = results
    
      
    })


    db.query('SELECT postagens.post_id, post_data, post_titulo, post_conteudo, post_destaque, img_nome FROM postagens INNER JOIN imagens ON postagens.post_id = imagens.post_id WHERE post_destaque = 0 AND post_ativo = 1', async (err, results) => {
        res.render('feed', 
        {postagens: results, pinned: this.fixado})
        // res.status(200).json({confirma: 'Sucesso', nResults: results.length, message: results});
    })
    

})

router.get("/pesquisa", (req, res) => {
    res.render("pesquisa", {results:pesquisar.pesquisa})
    
})


router.get("/configuracoes",(req, res) => {
    db.query('SELECT postagens.post_id, post_data, post_titulo, post_conteudo, img_nome FROM postagens INNER JOIN imagens ON postagens.post_id = imagens.post_id WHERE post_destaque = 1', async (err, results) => {
        exports.fixado = results
    
    })
    res.render('configuracoes', {nome: login.useNome2})
    

})

router.get("/perfil",(req, res) => {
    db.query('SELECT usuarios.use_id, coment_id, coment_texto, use_nome FROM comentarios INNER JOIN usuarios ON comentarios.use_id = usuarios.use_id WHERE coment_moderacao = 1 AND usuarios.use_id =?',[login.useId5], async (err, results) => {
        res.render('perfil', 
        {comentarios: results, nome:login.useNome2})
    })

})


router.get("/noticia/:post_id", (req, res) => {
    exports.post_id = req.params.post_id
    db.query('SELECT coment_texto, use_nome FROM comentarios INNER JOIN usuarios ON comentarios.use_id = usuarios.use_id WHERE post_id = ? AND coment_moderacao = 1;',[this.post_id], async (err, results) => {
        exports.comentarios = results
    })

    db.query('SELECT postagens.post_id, post_data, post_titulo, post_conteudo, img_nome FROM postagens INNER JOIN imagens ON postagens.post_id = imagens.post_id WHERE postagens.post_id = ?;',[this.post_id], async (err, results) => {
        res.render('noticia', 
        {conteudo: results, comentarios: this.comentarios})
    })

    
    
})

router.post('/comentar', (req, res)=>{
    const {coment} = req.body
    db.query('INSERT INTO comentarios (use_id, coment_texto, post_id, coment_pre_resposta, coment_status, coment_moderacao) VALUES (?,?,?,?,1,1)',[login.useId5,coment, this.post_id, ''],  async (err, results) => {
        console.log(err)
      
        res.redirect('/feed')
    })
})

router.get('/gps', (req, res) =>{
    res.render('gps')
})

router.get('/chat', (req, res) =>{
    res.render('chat')
})


//GERENCIAMENTO

router.get("/editar", (req, res) => {
    db.query('SELECT postagens.post_id, post_data, post_titulo, post_conteudo, post_destaque, post_ativo, img_nome FROM postagens INNER JOIN imagens ON postagens.post_id = imagens.post_id WHERE post_ativo=1', async (err, results) => {
        res.render('editar', 
        {postagens: results})
    })

})

router.get("/comentarios", (req, res) => {
    db.query('SELECT coment_id, coment_texto, use_nome FROM comentarios INNER JOIN usuarios ON comentarios.use_id = usuarios.use_id WHERE coment_moderacao = 1', async (err, results) => {
        res.render('comentarios', 
        {comentarios: results})
    })

})

router.get("/postagens", (req, res) => {
    res.render('postagens')

})

router.get("/mensagens", (req, res) => {
    res.render('mensagens')

})
router.get("/editar-dentro/:post_id", (req, res) => {
    exports.post_idEditar = req.params.post_id
    db.query('SELECT post_data, post_titulo, post_conteudo, img_nome FROM postagens INNER JOIN imagens ON postagens.post_id = imagens.post_id WHERE postagens.post_id = ?;',[this.post_idEditar], async (err, results) => {
        res.render('editar-dentro', 
        {conteudo: results})
    })
    

})

router.post('/atualizarPost', (req, res) =>{
    let {post_titulo, post_conteudo, fixar, ativar} = req.body
    if(fixar = null){
        let destaque = 0;
    }

    else{
        destaque = 1;
    }

    if(ativar = null){
        let ativado = 0
    }
    else{
        ativado = 1
    }

    db.beginTransaction(err => {
        if (err) {
            return res.render('editar', {
                message: 'Erro ao fazer a conexão'
            })
        }
        
        return db.query(
            'UPDATE postagens SET post_titulo = ?, post_conteudo = ?, post_destaque = ?, post_ativo = ? WHERE post_id =?', [post_titulo, post_conteudo, destaque, ativado, this.post_idEditar], async (err) => {

                if (err) {
                    return db.rollback(() => {
                       console.log(err);
                        return res.render('editar', {
                            message: 'Erro ao atualizar postagens'
                        })
                    });
                }

                let sampleFile;
                let uploadPath;
            
              
            
                sampleFile = req.files.sampleFile;
                uploadPath = path.join('./public/Imagens/', sampleFile.name)
                res.render('postagens')
                // uploadPath = __dirname + '/images/' + sampleFile.name
                sampleFile.mv(uploadPath, function(err){
                    if(err){
                        return res.status(500).send(err)
                    }
                })

                db.query(
                    'SELECT img_nome INTO imagens WHERE = post_id =?', [this.post_idEditar], (err, results) => {
                        exports.imagem_nome = results
                    }
                )

                if(!req.files || Object.keys(req.files).length === 0){
                    return res.status(400).send("nenhum arquivo upado")
                }

                

                return db.query(
                    
                    'UPDATE imagens SET img_nome = ? WHERE post_id = ?', [sampleFile.name, this.post_idEditar], (err) => {
                        if (err) {
                            return db.rollback(() => {
                              
                                return res.render('editar', {
                                    message: 'Erro ao atualizar Imagens'
                                })
                            });
                        }

                        return db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    
                                    return res.render('editar', {
                                        message: 'Commit falhou'
                                    })
                                });
                            }

                            else{
                                return db.rollback(() => {
                                    console.log(err)
                                    return res.render('editar', {
                                        message: 'Postagem atualizada com sucesso',
                                        
                                    })
                                });
                            }

                        });

            });
            

    });
    
});

    
})

router.get("/comentario-dentro/:coment_id", (req, res) => {
    exports.coment_id = req.params.coment_id
    db.query('SELECT coment_id, coment_texto, use_nome FROM comentarios INNER JOIN usuarios ON comentarios.use_id = usuarios.use_id WHERE coment_id = ?',[this.coment_id], async (err, results) => {
        res.render('comentario-dentro', 
        {comentarios_dentro: results})
    })
    

})

router.post('/uparComentario', (req, res) =>{
    db.query(
        'UPDATE comentarios SET coment_moderacao = 0 WHERE coment_id = ?', [this.coment_id], (err, results) => {
            res.redirect('/comentarios')
    })
})

module.exports = router