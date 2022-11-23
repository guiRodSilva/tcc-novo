const db = require("../database/connection");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const { connect } = require("../database/connection");
const { createConnection } = require("mysql");
const { promisify } = require("util");
const login = require('../controllers/login');
const { search } = require("../routes/routes");



exports.update = async (req, res) => {
    let { use_nome, use_email, use_senha, confirmaSenha, rua, numero, bairro, CEP, cidade, UF } = req.body
    
    let hashedPassword = await bcrypt.hash(use_senha, 8)
    console.log(hashedPassword)  

    db.beginTransaction(err => {
        if (err) {
            return res.render('configuracoes', {
                message: 'Erro ao fazer a conexão'
            })
        }
        
        db.query(
            'UPDATE usuarios SET use_nome = ?, use_email =?, use_senha =? WHERE use_email = ?', [use_nome, use_email, use_senha = hashedPassword, login.useEmail], async (err) => {
                if (err) {
                    return db.rollback(() => {
                       console.log(err);
                        return res.render('configuracoes', {
                            message: 'Erro ao atualizar usuarios'
                        })
                    });
                }

                

             
                db.query(

                    'UPDATE cidades SET cid_nome = ?, cid_uf = ? WHERE cid_id = ?', [cidade, UF, login.useId3], (err) => {
                        if (err) {
                            return db.rollback(() => {
                              
                                return res.render('configuracoes', {
                                    message: 'Erro ao atualizar cidades'
                                })
                            });
                        }

                db.query(
            
                    'UPDATE enderecos SET end_logradouro = ?, end_num = ?, end_bairro =?, end_cep =? WHERE use_id = ?', [rua, numero, bairro, CEP, login.useId], (err) => {
                        
                        
                        if (err) {
                            return db.rollback(() => {
                                console.log(err)
                                return res.render('configuracoes', {
                                    message: 'Erro ao atualizar enderecos',
                                    
                                })
                            });
                        }

                
                                    return db.commit((err) => {
                                        if (err) {
                                            return db.rollback(() => {
                                                
                                                return res.render('configuracoes', {
                                                    message: 'Commit falhou'
                                                })
                                            });
                                        }

                                        else{
                                            return db.rollback(() => {
                                                console.log(err)
                                                exports.aviso = 'logar denovo'

                                                return res.redirect('/sair')
                                            });
                                        }

                                    });
                        
                       
                    })
                    
                    

            });
            

    });

})

        db.query(
                    
            'SELECT * FROM usuarios',  (err, results) => {
                exports.aqueleNome = results[0].use_nome
                console.log(this.aqueleNome)
                
                if (err) {
                    return db.rollback(() => {
                        console.log(err)
                        return res.render('configuracoes', {
                            message: 'Erro ao pegar o nome do usuário',
                            
                        })
                    });
                }
            })

}

