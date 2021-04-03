var Bicicleta = require('../models/bicicleta')

module.exports = {
    list: function(req, res, next){
        Bicicleta.find({}, (err, bicicletas) => {
            res.render('bicicletas/index', {bicicletas: bicicletas})
        })
    },
    update_get: function(req, res, next){
        Bicicleta.findById(req.params.id, function(err, bicicleta){
            res.render('bicicletas/update', {errors:{}, bicicleta: bicicleta})
        })
    },
    update: function(req, res, next){
        var update_values = {color: req.body.color, modelo: req.body.modelo, ubicacion: [req.body.lat, req.body.lng]}
        Bicicleta.findByIdAndUpdate(req.params.id, update_values, function(err, bicicleta){
            if(err){
                console.log(err)
                res.render('bicicletas/update', {errors: err.errors, bicicleta: new Bicicleta({color: req.body.color, modelo: req.body.modelo, ubicacion: [req.body.lat, req.body.lng]})})
            }else{
                res.redirect('/bicicletas')
                return
            }
        })
    },
    create_get: function(req, res, next){
        res.render('bicicletas/create', {errors:{}, bicicleta: new Bicicleta()})
    },
    create: function(req, res, next){
        Bicicleta.create({color: req.body.color, modelo: req.body.modelo, ubicacion: [req.body.lat, req.body.lng]}, function(err, nuevaBicicleta){
            if(err){
                res.render('bicicletas/create', {errors: err.errors, bicicleta: new Bicicleta({color: req.body.color, modelo: req.body.modelo, ubicacion: [req.body.lat, req.body.lng]})})
            }else{
                res.redirect('/bicicletas')
            }
        })
    },
    delete: function(req, res, next){
        Bicicleta.findByIdAndDelete(req.body.id, function(err){
            if(err)
                next(err)
            else
                res.redirect('/bicicletas')
        })
    }
}