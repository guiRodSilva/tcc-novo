const fileUpload = require('express-fileupload')

exports.cadGerenciamento = async(req, res) =>{
    let sampleFile;
    let uploadPath;

    if(!req.files || Object.keys(req.files).length ===0){
        return res.status(400).send("nenhum arquivo upado")
   
    }

    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + '../images/' + sampleFile.name
    sampleFile.mv(uploadPath, function(err){
        if(err){
            return res.status(500).send(err)
        }
    })


}