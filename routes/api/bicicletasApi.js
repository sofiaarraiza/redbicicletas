var express = require('express')
var router = express.Router()
var bicicletaControllerApi = require('../../controllers/api/bicicletaControllerApi')

router.get('/', bicicletaControllerApi.bicicleta_list)
router.post('/create', bicicletaControllerApi.bicicleta_create)
router.delete('/delete/:id', bicicletaControllerApi.bicicleta_delete)
router.post('/update/:id', bicicletaControllerApi.bicicleta_update)

module.exports = router;