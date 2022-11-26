const express = require('express')
const router = express.Router()
const login = require('../controllers/login')
const { route, post } = require('./routes')
const db = require("../database/connection");
const update = require('../controllers/update')
const pesquisar = require('../controllers/pesquisar')




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


    db.query('SELECT post_data, post_titulo, post_conteudo, img_nome FROM postagens INNER JOIN imagens ON postagens.post_id = imagens.post_id;', async (err, results) => {
        res.render('feed', 
        {postagens: results})
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


module.exports = router



