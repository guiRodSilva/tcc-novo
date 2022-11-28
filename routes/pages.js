const express = require('express')
const router = express.Router()
const login = require('../controllers/login')
const { route, post } = require('./routes')
const db = require("../database/connection");
const update = require('../controllers/update')
const pesquisar = require('../controllers/pesquisar');
const e = require('express');




router.get("/configuracoes",(req, res) => {
    res.render('configuracoes', {nome: login.useNome})
    

})

router.get("/perfil",(req, res) => {
    db.query('SELECT * FROM comentarios', async (err, results) => {
        res.render('perfil', 
        {comentarios: results, nome:login.useNome2})
    })

})

router.get("/feed",(req, res) => {

    db.query('SELECT postagens.post_id, post_data, post_titulo, post_conteudo, img_nome FROM postagens INNER JOIN imagens ON postagens.post_id = imagens.post_id WHERE post_destaque = 1', async (err, results) => {
        exports.fixado = results
        
      
    })

    db.query('SELECT postagens.post_id, post_data, post_titulo, post_conteudo, post_destaque, img_nome FROM postagens INNER JOIN imagens ON postagens.post_id = imagens.post_id WHERE post_destaque = 0', async (err, results) => {
        res.render('feed', 
        {postagens: results, pinned: this.fixado})
    })

})

router.get('/', (req, res) =>{
    res.render("home", {aviso: update.aviso})
})

router.get("/cadastrar", (req, res) => {
    res.render("cadastrar")
})

router.get("/login", (req, res) => {
    res.render("login")
})

router.get("/pesquisa", (req, res) => {
    res.render("pesquisa", {results:pesquisar.pesquisa})
})

router.get("/noticia/:post_id", (req, res) => {
    exports.post_id = req.params.post_id
    db.query('SELECT post_data, post_titulo, post_conteudo, img_nome FROM postagens INNER JOIN imagens ON postagens.post_id = imagens.post_id WHERE postagens.post_id = ?;',[this.post_id], async (err, results) => {
        db.query('SELECT coment_texto FROM comentarios;',[this.post_id], async (err, results) => {
            exports.comentarios = results
        })
        res.render('noticia', 
        {conteudo: results, comentarios: this.comentarios})
    })

    
    
})

router.post('/comentar', (req, res)=>{
    const {coment} = req.body
    db.query('INSERT INTO comentarios (use_id, coment_texto, post_id, coment_pre_resposta, coment_status, coment_moderacao) VALUES (5,?,?,?,1,1)',[coment, this.post_id, ''],  async (err, results) => {
        console.log(err)
        console.log(this.post_id)
        res.render('noticia', {message:'Deu bom'})   
    })
})


module.exports = router



