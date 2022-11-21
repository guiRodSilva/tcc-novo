const db = require("../database/connection");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const { connect } = require("../database/connection");
const { createConnection } = require("mysql");
const { promisify } = require("util");


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
            'UPDATE usuarios SET (use_nome,use_email, use_senha, use_tipo) VALUES (?,?,?, 0)', [use_nome, use_email, use_senha = hashedPassword], async (err) => {

                if (err) {
                    return db.rollback(() => {
                       console.log(err);
                        return res.render('configuracoes', {
                            message: 'Erro ao atualizar usuarios'
                        })
                    });
                }

             
                db.query(
                    'UPDATE cidades SET (cid_nome, cid_uf) VALUES (?,?)', [cidade, UF], (err) => {
                        if (err) {
                            return db.rollback(() => {
                              
                                return res.render('configuracoes', {
                                    message: 'Erro ao atualizar cidades'
                                })
                            });
                        }

                db.query(
            
                    'UPDATE enderecos SET (end_logradouro, end_num, end_bairro, end_cep) VALUES (?,?,?,?)', [rua, numero, bairro, CEP], (err) => {
                        
                        
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
                                    return res.render('configuracoes', {
                                        message: 'Usuário atualizado com sucesso',
                                        
                                    })
                                });
                            }

                        });
                        
                        
                    })
                    
                    

            });
            

    });

})
}

