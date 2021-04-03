var Bicicleta = require('../../models/bicicleta')

exports.bicicleta_list = function(req, res){
    Bicicleta.find({}, function(err, bicicletas){
        res.status(200).json({
            bicicletas: bicicletas
        })
    })
}

exports.bicicleta_create = function(req, res){
    var bicicleta = new Bicicleta({color: req.body.color, modelo: req.body.modelo, ubicacion: [req.body.lng, req.body.lat]})

    bicicleta.save(function(err){
        res.status(200).json(bicicleta)
    })
}

exports.bicicleta_delete = function(req, res){
    Bicicleta.deleteOne({_id: req.params.id}, function(err){
        if (err) return handleError(err);
        res.send('ok')
    }) 
}

exports.bicicleta_update = function(req, res){
    var bici = Bicicleta.findById(req.body.id)
    bici.id = req.body.id
    bici.color = req.body.color
    bici.modelo = req.body.modelo
    bici.ubicacion = [req.body.lat, req.body.lng]

    res.status(200).json({
        bicicleta: bici
    })
}