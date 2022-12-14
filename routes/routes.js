const express = require('express')
const router = express.Router()
const cadastrar = require('../controllers/cadastrar')
const login = require("../controllers/login")
const update = require('../controllers/update')
const sair = require('../controllers/sair')
const pesquisar = require('../controllers/pesquisar')
const cadGerenciamento = require('../controllers/cadGerencimento')



router.post('/cadastrar', cadastrar.cadastrar)
router.post('/login', login.login)
router.post('/update', update.update)
router.post('/pesquisar', pesquisar.pesquisar)
router.post('/cadGerenciamento', cadGerenciamento.cadGerenciamento)
router.get('/sair', sair.sair);

module.exports = router



