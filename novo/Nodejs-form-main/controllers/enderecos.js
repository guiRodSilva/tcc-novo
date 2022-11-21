const db = require("../database/connection");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const { connect } = require("../database/connection");
const { createConnection } = require("mysql");
const { promisify } = require("util");
const login = require('../controllers/login')


exports.cidades = async (req, res) =>{
    db.query('SELECT * FROM enderecos WHERE use_id = ?', [login.useId2], async (err, results) => {
        console.log(results)
        exports.cidadeId = results[0].cid_id
    })
}