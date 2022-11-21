const express = require('express')
const router = express.Router()
const cadastrar = require('../controllers/cadastrar')
const login = require("../controllers/login")
const sair = require('../controllers/sair')

router.post('/cadastrar', cadastrar.cadastrar)
router.post('/login', login.login)
router.get('/sair', sair.sair);

module.exports = router



