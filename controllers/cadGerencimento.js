const fileUpload = require('express-fileupload')
const path = require('path')
const db = require('../database/connection')
exports.cadGerenciamento = async(req, res) =>{


    let {titulo, texto, fixado} = req.body
    if(fixado = null){
        let destaque = 0;
    }

    else{
        destaque = 1;
    }
    db.beginTransaction(err => {
        if (err) {
            return res.render('postagens', {
                message: 'Erro ao fazer a conexão'
            })
        }
        
        return db.query(
            'INSERT INTO postagens (post_data ,post_titulo, post_conteudo, post_destaque, post_ativo, pre_id) VALUES (?,?,?, ?, 1, 6)', [new Date(), titulo, texto, destaque], async (err) => {

                if (err) {
                    return db.rollback(() => {
                       console.log(err);
                        return res.render('postagens', {
                            message: 'Erro ao cadastrar postagens'
                        })
                    });
                }

                let sampleFile;
                let uploadPath;
            
                if(!req.files || Object.keys(req.files).length === 0){
                    return res.status(400).send("nenhum arquivo upado")
                }
            
                sampleFile = req.files.sampleFile;
                uploadPath = path.join('./public/Imagens/', sampleFile.name)
                res.render('postagens')
                // uploadPath = __dirname + '/images/' + sampleFile.name
                sampleFile.mv(uploadPath, function(err){
                    if(err){
                        return res.status(500).send(err)
                    }
                })

                return db.query(
                    
                    'INSERT INTO imagens (img_descricao, img_nome, post_id) VALUES (?,?, LAST_INSERT_ID())', ['imagem do post', sampleFile.name], (err) => {
                        if (err) {
                            return db.rollback(() => {
                              
                                return res.render('postagens', {
                                    message: 'Erro ao cadastrar Imagens'
                                })
                            });
                        }

                        return db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    
                                    return res.render('postagens', {
                                        message: 'Commit falhou'
                                    })
                                });
                            }

                            else{
                                return db.rollback(() => {
                                    console.log(err)
                                    return res.render('postagens', {
                                        message: 'Postagem cadastrada com sucesso',
                                        
                                    })
                                });
                            }

                        });

            });
            

    });
    
});

    

   


}