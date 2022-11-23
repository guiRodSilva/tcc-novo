const express = require('express')
const router = express.Router()
const login = require('../controllers/login')
const { route, post } = require('./routes')
const db = require("../database/connection");
const update = require('../controllers/update')



router.get("/configuracoes",(req, res) => {
    res.render('configuracoes', {nome: login.useNome})
    

})

router.get("/perfil",(req, res) => {
    res.render('perfil', {nome: login.useNome2})
    

})

router.get("/feed",(req, res) => {
    res.render('feed')

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


module.exports = router



