const Express = require('express')
const router = Express.Router()
const OrdersController = require('../controllers/ordersController')
const authMiddleware = require('../middleware/auth')
const { check } = require('express-validator')


// /api/orders/new
// Insertar una orden
router.post('/new',
    authMiddleware,
    [
        check('folio').isEmpty().withMessage('El folio no se puede introducir manualmente'),
        check('currency').not().isEmpty().withMessage('La moneda es obligatoria'),
        check('articles').isArray().notEmpty().withMessage('La orden debe contener articulos'),
        check('provider').notEmpty().isMongoId().withMessage('El proveedor debe ser un id'),
    ],
    OrdersController.createOrder)

// /api/orders/
// Obtener todas las ordenes
router.get('/',
    authMiddleware,
    OrdersController.getOrders)

// /api/orders/ via ID
// Actualizar una orden
router.put('/:id',
    authMiddleware,
    [   
        check('folio').isEmpty().withMessage('No se puede modificar el folio')
    ],
    OrdersController.updateOrder)

// /api/orders/ via ID
// Eliminar una orden
router.delete('/:id',
    authMiddleware,
    OrdersController.deleteOrder)

module.exports = router