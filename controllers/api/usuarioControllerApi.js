var Usuario = require('../../models/usuario')

exports.usuario_list = function(req, res){
    Usuario.find({}, function(err, usuarios){
        res.status(200).json({
            usuarios: usuarios
        })
    })
}

exports.usuario_create = function(req, res){
    var usuario = new Usuario({nombre: req.body.nombre, email: req.body.email, password: req.body.password})

    usuario.save(function(err){
        if(err) return res.status(500).json(err)
        res.status(200).json(usuario)
    })
}

exports.usuario_delete = function(req, res){
    Usuario.deleteOne({_id: req.params.id}, function(err){
        if (err) return handleError(err);
        res.send('ok')
    }) 
}

exports.usuario_reservar = function(req, res){
    Usuario.findById(req.body.id, function(err, usuario){
        console.log(usuario)
        usuario.reservar(req.body.bici_id, req.body.desde, req.body.hasta, function(err){
            console.log('reserva!!')
            res.status(200).send()
        })
    })
}

