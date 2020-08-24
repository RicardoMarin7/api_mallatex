// Users routes
const express = require('express')
const router = express.Router()
const articlesController = require('../controllers/articlesController')
const { check } = require('express-validator')
const auth = require('../middleware/auth')


//Crea un usuario
// api/articles/new
router.post('/new',
    auth,
    [
        check('code').custom(value => !/\s/.test(value)).withMessage('El articulo no debe contener espacios').not().isEmpty().withMessage('El codigo del articulo es obligatorio'),
        check('description').not().isEmpty().withMessage('El articulo debe contener una descripcion'),
        check('unit').not().isEmpty().withMessage('El articulo debe contener una unidad'),
        check('price').isNumeric().withMessage('Debe ser un numero').not().isEmpty().withMessage('El articulo debe tener un precio')
    ],
    articlesController.createArticle)

module.exports = router
