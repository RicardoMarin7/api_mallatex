const Order = require('../models/Orders')
const Counter = require('../models/Counters')
const User = require('../models/Users')

const { validationResult } = require('express-validator')


const getNextSecuenceValue = async () =>{
    const filter = { _id: 'ordersfolio'}
    const update = {$inc:{sequence_value:1}}
    let nextSecuenceValue = await Counter.findOneAndUpdate(filter,update)
    return nextSecuenceValue.sequence_value
}

exports.createOrder = async (req,res) =>{

    const error = validationResult(req)

    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()})
    }

    try {
        //Crear una nueva orden
        const order = new Order(req.body)
        //Guardar creador via json web token
        order.createdby = req.user.id
        order.folio = await getNextSecuenceValue()
        order.save()
        res.json(order)
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}

//Obtiene todas las ordenes del usuario actual
exports.getOrders = async (req,res) =>{
    try {
        const orders = await Order.find({ createdby: req.user.id }).sort({folio:-1})
        res.json({orders})
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}

//Actualizar Orden
exports.updateOrder = async (req,res) =>{

    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()})
    }

    const {level} = await User.findById(req.user.id)
    
    //Extraer informacion de proyecto
    const {
        provider,
        sentvia,
        fob,
        sendemployee,
        currency,
        boughtdate,
        state
    } = req.body

    const newOrder = {}

    if(provider){ newOrder.provider = provider }
    if(sentvia){ newOrder.sentvia = sentvia }
    if(fob){ newOrder.fob = fob }
    if(sendemployee){ newOrder.sendemployee = sendemployee }
    if(currency){ newOrder.currency = currency }
    if(boughtdate){ newOrder.boughtdate = boughtdate }
    if(state){
        if(level < 2){
            return res.status(401).json({msg:'No tienes autorizacion para hacer este movimiento'})
        }
        newOrder.state = state
    }

    try {
        //Revisar el id
        let order = await Order.findById(req.params.id)

        //Revisar si existe la orden
        if(!order){
            return res.status(404).json({msg:'Proyecto no encontrado'})
        }

        //verificar creador o nivel del usuario
        if(order.createdby.toString() !== req.user.id){
            return res.status(401).json({msg:'No tienes autorizacion para hacer este movimiento'})
        }

        //actualizar
        order = await Order.findByIdAndUpdate({_id: req.params.id}, {$set: newOrder}, {new:true},)

        res.json({order})

    } catch (error) {
        console.log(error)
        res.status(500).send('Error en el servidor')
    }
}