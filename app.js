const express = require('express');
const hbs = require('hbs')
const path = require("path")
const dotenv = require('dotenv')
const moment = require('moment')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
dotenv.config({ path: './env'})


const app = express();
hbs.registerHelper('dateFormat', require('handlebars-dateformat'));
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: 'true'}))
app.use(express.json())

app.set('view engine', 'hbs')

const publicDir = path.join(__dirname, './public')
const loginDir = path.join(__dirname,'./login')
const cadastrarDir = path.join(__dirname,'./cadastrar')
const homeDir = path.join(__dirname,'./home')
const configuracoesDir = path.join(__dirname, './configuracoes')
const perfilDir = path.join(__dirname, './perfil')
const feedDir = path.join(__dirname, './feed')
const noticiaDir = path.join(__dirname, './noticia')
const editarDir = path.join(__dirname, './editar')
const comentariosDir = path.join(__dirname, './comentarios')
const postagensDir = path.join(__dirname, './postagens')
const mensagensDir = path.join(__dirname, './mensagens')
const editar_dentroDir = path.join(__dirname, './editar-dentro')
const comentario_dentroDir = path.join(__dirname, './comentario-dentro')

app.use(express.static(publicDir))
app.use(express.static(homeDir))
app.use(express.static(configuracoesDir))
app.use(express.static(loginDir))
app.use(express.static(cadastrarDir))
app.use(express.static(perfilDir))
app.use(express.static(feedDir))
app.use(express.static(noticiaDir))
app.use(express.static(editarDir))
app.use(express.static(comentariosDir))
app.use(express.static(postagensDir))
app.use(express.static(mensagensDir))
app.use(express.static(editar_dentroDir))
app.use(express.static(comentario_dentroDir))

const router = require('./routes/routes');
const pages = require('./routes/pages');

app.use(router)
app.use(pages)
app.listen(5000, ()=> {
    console.log("server started on port 5000")
})