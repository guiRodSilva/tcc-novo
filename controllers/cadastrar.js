const db = require("../database/connection");
const bcrypt = require('bcryptjs');
const { connect } = require("../database/connection");
const { createConnection } = require("mysql");
const os = require("os");
const e = require("express");

exports.cadastrar = async (req, res) => { 
  
   
    let { use_nome, use_email, use_senha, confirmaSenha, rua, numero, bairro, CEP, cidade, UF } = req.body
    

    db.query('SELECT use_email FROM usuarios WHERE use_email = ?', [use_email], async (error, result) => {
        if(error){
            console.log(error)
        }

        if( result.length > 0 ) {
            return res.render('cadastrar', {
                message: 'O email ja está sendo usado'
            }),
            res.status(401).json({confirma: 'Erro', message: 'O email ja está sendo usado'});
        } else if(use_senha !== confirmaSenha) {
            return res.render('cadastrar', {
                message: 'As senhas não conferem'
            }),
            res.status(401).json({confirma: 'Erro', message: 'As senhas não conferem'});
        }
    
         
            
    })


    
    // || = or
    if (!use_email  || !use_senha){
        return res.render('cadastrar', {
            message: 'Insira um email e senha'
        }),
        res.status(401).json({confirma: 'Erro', message: 'Insiria um email ou senha'});
    }
    else if(!use_nome){
        return res.render('cadastrar', {
            message: 'Insira um nome'
        }),
        res.status(401).json({confirma: 'Erro', message: 'Insiria um nome'});
    }

    else{
        let hashedPassword = await bcrypt.hash(use_senha, 8)
        console.log(hashedPassword)  
        
        return db.beginTransaction(err => {
            if (err) {
                return res.render('cadastrar', {
                    message: 'Erro ao fazer a conexão'
                }),
                res.status(401).json({confirma: 'Erro', message: 'Erro ao fazer a conexão'});
            }
            
            return db.query(
                'INSERT INTO usuarios (use_nome,use_email, use_senha, use_tipo) VALUES (?,?,?, 0)', [use_nome, use_email, use_senha = hashedPassword], async (err) => {

                    if (err) {
                        return db.rollback(() => {
                           console.log(err);
                            return res.render('cadastrar', {
                                message: 'Erro ao cadastrar usuarios'
                            }),
                            res.status(401).json({confirma: 'Erro', message: 'Erro ao cadastrar usuarios'});
                        });
                    }
    
                 
                    return db.query(
                        'INSERT INTO cidades (cid_nome, cid_uf) VALUES (?,?)', [cidade, UF], (err) => {
                            if (err) {
                                return db.rollback(() => {
                                  
                                    return res.render('cadastrar', {
                                        message: 'Erro ao cadastrar cidades'
                                    }),
                                    res.status(401).json({confirma: 'Erro', message: 'Erro ao cadastrar cidades'});
                                });
                            }

                    
    
                    return db.query(
                    
                        'INSERT INTO enderecos (use_id, end_logradouro, end_num, end_bairro, end_cep, cid_id) VALUES (LAST_INSERT_ID(),?,?,?,?,LAST_INSERT_ID())', [rua, numero, bairro, CEP], (err) => {
                            
                            
                            if (err) {
                                return db.rollback(() => {
                                    console.log(err)
                                    return res.render('cadastrar', {
                                        message: 'Erro ao cadastrar enderecos',
                                        
                                    }),
                                    res.status(401).json({confirma: 'Erro', message: 'Erro ao cadastrar enderecos'});
                                    
                                });
                                
                            }
                            return db.commit((err) => {
                                if (err) {
                                    return db.rollback(() => {
                                        
                                        return res.render('cadastrar', {
                                            message: 'Commit falhou'
                                        }),
                                        res.status(401).json({confirma: 'Erro', message: 'Erro ao fazer o commit'});
                                    });
                                }

                                else{
                                    return db.rollback(() => {
                                        console.log(err)
                                        return res.render('cadastrar', {
                                            message: 'Usuário cadastrado com sucesso',
                                            
                                        })
                                        res.status(200).json({confirma: 'Sucesso', message: 'Usuário cadastrado com sucesso'});
                                    });
                                }
    
                            });
                            
                            
                        })
                        
                        
    
                });
                
    
        });
        
    });

    
    }
    
    
}
