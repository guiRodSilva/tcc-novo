const db = require("../database/connection");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const { connect } = require("../database/connection");
const { createConnection } = require("mysql");
const { promisify } = require("util");
const { aqueleNome } = require("./update");
const express = require('express')
const router = express.Router()

exports.login = async (req, res) => { 
    
    try {
        const {use_email, use_senha} = req.body;
        if (!use_email || !use_senha) {
            return res.status(400).render('login', {
                message: "Please Provide an email and password"
            })
        }
        
        db.query('SELECT * FROM usuarios WHERE use_email = ?', [use_email], async (err, results) => {
            console.log(results);
            
            exports.useNome = results[0].use_nome
            exports.useNome2 = results[0].use_nome
            exports.useEmail = results[0].use_email
            exports.useId = results[0].use_id
            exports.useId2 = results[0].use_id
            exports.useId3 = results[0].use_id
            exports.useId4 = results[0].use_id
            if (!results || !await bcrypt.compare(use_senha, results[0].use_senha)) {
                res.status(401).render('login', {
                    message: 'Email ou senha incorretos'
                })
            
                
            }
        
            else if(results[0].use_tipo == 1){

                    const id = results[0].id;
    
                    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES
                    });
    
                    console.log("the token is " + token);
    
                    const cookieOptions = {
                        expires: new Date(
                            Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                        ),
                        httpOnly: true
                    }
    
                    res.cookie('userSave', token, cookieOptions);
                    res.redirect('/editar')
                    
                

            }

            else if (results[0].use_tipo == 0) {
                const id = results[0].id;

                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES
                });

                console.log("the token is " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                res.cookie('userSave', token, cookieOptions);
                res.redirect('/configuracoes')
                
                
                
            }
            else{
                res.render('login', {message: 'deu tudo errado boy'})
            }
            
        })
        
    } catch (err) {
        console.log(err);
    }
}

exports.logado = async (res, req, next) =>{
    
    if (req.cookies.userSave) {
         try {
             // 1. Verify the token
             const decoded = await promisify(jwt.verify)(req.cookies.userSave,
                 process.env.JWT_SECRET
             );
             console.log(decoded);
 
             // 2. Check if the user still exist
             db.query('SELECT * FROM usuarios WHERE use_id = ?', [decoded.id], (err, results) => {
                 console.log(results);
                 if (!results) {
                     return next();
                 }
                 req.user = results[0];
                 return next();
             });
         } catch (err) {
             console.log(err)
             return next();
         }
     } else {
         next();
     }
}

//     try{
//         const {use_email, use_senha} = req.body
//         if(!use_email || !use_senha){
//             return res.render('login', {
//                 message: 'Insira um email e senha'
//             })
//     }

    
//         db.query('SELECT * FROM usuarios WHERE use_email = ?', [use_email], async (error, result) => {
//             console.log(result)
//             if( !result.length || !await bcrypt.compare(use_senha, result[0].use_senha)) {
//                 return res.render('login', {
//                     message: 'Email ou senha incorretos'
//                 })
//             } else {
//                 const id = result[0].id
//                 const token = jwt.sign({id}, process.env.JWT_SECRET,{
//                     expiresIn: process.env.JWT_EXPIRES
//                 })
//                 console.log("the token is " + token);
//                 const cookieOptions = {
//                     expires: new Date (Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
//                     httpOnly: true
//                 }
//                 res.cookie("usuarioCadastrado", token, cookieOptions);
//                 res.status(200).redirect("/profile");

                
//             }
//         })
           
//     }catch(error){
//         console.log(error)
//     }       
// };

    
