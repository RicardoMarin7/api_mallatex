// Users routes
const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/authController')
const { check } = require('express-validator')
const auth = require('../middleware/auth')


//Crea un usuario
// api/auth/login
router.post('/login',
    [
        check('email').isEmail().withMessage('Agrega un email valido'),
        check('password').isLength({ min:8 }).withMessage('El password debe tener minimo 8 caracteres')
    ],
    AuthController.Login)

router.get('/',
    auth,
    AuthController.userAuthenticated)

module.exports = router