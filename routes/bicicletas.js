var express = require('express');
var router = express.Router();
var bicicletaController = require('../controllers/bicicletaController')

/* GET bicicletas listing. */
router.get('/', bicicletaController.list)
router.get('/create', bicicletaController.create_get)
router.post('/create', bicicletaController.create)
router.post('/:id/update', bicicletaController.update)
router.get('/:id/update', bicicletaController.update_get)
router.post('/:id/delete', bicicletaController.delete)

module.exports = router;