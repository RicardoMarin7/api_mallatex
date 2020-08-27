// Users routes
const express = require('express')
const router = express.Router()
const providersController = require('../controllers/providersController')
const { check } = require('express-validator')
const auth = require('../middleware/auth')


//Crea un Proveedor
// api/providers/new
router.post('/new',
    auth,
    [
        check('code').isEmpty().withMessage('No puedes modificar el codigo del proveedor'),
        check('name').not().isEmpty().withMessage('El proveedor debe contener una descripcion'),
        check('address').not().isEmpty().withMessage('El proveedor debe contener una direccion'),
        check('phone').isNumeric().withMessage('El telefono no debe contener letras'),
        check('email').isEmail().withMessage('El email debe ser valido "example@gmai.com"'),
    ],
    providersController.createProvider)

router.get('/',
    auth,
    providersController.getProviders)

router.put('/:id',
    auth,
    [
        check('code').isEmpty().withMessage('No se puede modificar el codigo del articulo'),
        check('phone').isNumeric().optional({checkFalsy:true}).withMessage('El telefono no debe contener letras'),
        check('email').isEmail().optional({checkFalsy:true}).withMessage('El email debe ser valido (example@gmail.com)')
    ],
    providersController.updateProvider)

router.delete('/:id',
    auth,
    providersController.deleteProvider)

module.exports = router