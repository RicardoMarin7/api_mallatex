// Users routes
const express = require('express')
const router = express.Router()
const usuarioController = require('../controllers/userController')
const { check } = require('express-validator')
const auth = require('../middleware/auth')


//Crea un usuario
// api/usuarios/new
router.post('/new',
    [
        check('name').not().isEmpty().withMessage('El nombre es obligatorio'),
        check('email').isEmail().withMessage('Agrega un email valido'),
        check('password').isLength({ min:8 }).withMessage('El password debe tener minimo 8 caracteres')
    ],
    usuarioController.CreateUser)

router.get('/',
auth,
usuarioController.getUsers)

module.exports = router
