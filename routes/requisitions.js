const Express = require('express')
const router = Express.Router()
const RequisitionsController = require('../controllers/requisitionsController')
const authMiddleware = require('../middleware/auth')
const { check } = require('express-validator')


// /api/orders/new
// Insertar una requisicion
router.post('/new',
    authMiddleware,
    [
        check('folio').isEmpty().withMessage('El folio no se puede introducir manualmente'),
        check('articles').isArray().notEmpty().withMessage('La orden debe contener articulos'),
    ],
    RequisitionsController.createRequisition)

// /api/orders/
// Obtener todas las requisiciones
router.get('/',
    authMiddleware,
    RequisitionsController.getRequisitions)

// /api/Requisitions/ via ID
// Actualizar una requisicion
router.put('/:id',
    authMiddleware,
    [   
        check('folio').isEmpty().withMessage('No se puede modificar el folio')
    ],
    RequisitionsController.updateRequisition)

// /api/Requisitions/ via ID
// Eliminar una requisicion
router.delete('/:id',
    authMiddleware,
    RequisitionsController.deleteRequisition)

module.exports = router