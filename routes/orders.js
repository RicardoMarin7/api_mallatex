const Express = require('express')
const router = Express.Router()
const OrdersController = require('../controllers/ordersController')
const authMiddleware = require('../middleware/auth')
const { check } = require('express-validator')


// /api/orders/new
router.post('/new',
    authMiddleware,
    [
        check('folio').not().isEmpty().withMessage('El folio es obligatorio'),
        check('currency').not().isEmpty().withMessage('La moneda es obligatoria')
    ],
    OrdersController.createOrder)

// /api/orders/
router.get('/',
    authMiddleware,
    OrdersController.getOrders)

// /api/orders/ via ID
router.put('/:id',
    authMiddleware,
    [   
        check('folio').isEmpty()
    ],
    OrdersController.updateOrder)

module.exports = router