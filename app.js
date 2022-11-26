const express = require('express');
const hbs = require('hbs')
const path = require("path")
const dotenv = require('dotenv')
const moment = require('moment')
const cookieParser = require('cookie-parser');


dotenv.config({ path: './env'})


const app = express();
hbs.registerHelper('dateFormat', require('handlebars-dateformat'));
app.use(cookieParser())
app.use(express.urlencoded({extended: 'false'}))
app.use(express.json())


app.set('view engine', 'hbs')



const publicDir = path.join(__dirname, './public')
const loginDir = path.join(__dirname,'./login')
const cadastrarDir = path.join(__dirname,'./cadastrar')
const homeDir = path.join(__dirname,'./home')
const configuracoesDir = path.join(__dirname, './configuracoes')
const perfilDir = path.join(__dirname, './perfil')
const feedDir = path.join(__dirname, './feed')

app.use(express.static(publicDir))
app.use(express.static(homeDir))
app.use(express.static(configuracoesDir))
app.use(express.static(loginDir))
app.use(express.static(cadastrarDir))
app.use(express.static(perfilDir))
app.use(express.static(feedDir))

const router = require('./routes/routes');
const pages = require('./routes/pages');

app.use(router)
app.use(pages)
app.listen(5000, ()=> {
    console.log("server started on port 5000")
})