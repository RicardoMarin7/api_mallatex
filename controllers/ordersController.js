const Order = require('../models/Orders')
const Counter = require('../models/Counters')
const User = require('../models/Users')
const Article = require('../models/Articles')

const { validationResult } = require('express-validator')


const getNextSecuenceValue = async () =>{
    const filter = { _id: 'ordersfolio'}
    const update = {$inc:{sequence_value:1}}
    let nextSecuenceValue = await Counter.findOneAndUpdate(filter,update)
    return nextSecuenceValue.sequence_value
}

const getArticle = async (id) =>{
    const article = await Article.findById(id)
    return article
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
        
        //Iteramos cada articulo y verificamos que exista

        for(let i=0;i<order.articles.length;i++){
            const article = await getArticle(order.articles[i].article)
            if(!article){
                return res.status(404).json({msg:`El articulo con el id:${order.articles[i].article} no fue encontrado`})
            }
        }

        await order.save()
        res.json(order)
    } catch (error) {
        console.log(error)
        res.status(500).send(`Error:${error.message}`)
    }
}

//Obtiene todas las ordenes del usuario actual
exports.getOrders = async (req,res) =>{
    try {

        let orders
        if(req.user.level < 2){
            orders = await Order
                                .find({ requestedby: req.user.id })
                                .populate({ path:"articles.article"})
                                .populate('createdby','-password')
                                .populate('requestedby','-password')
                                .populate('provider')
                                .sort({folio:-1})
        }
        else{
            orders = await Order
                                .find()
                                .populate({ path:"articles.article"})
                                .populate('createdby','-password')
                                .populate('reviewedby','-password')
                                .populate('requestedby','-password')
                                .populate('provider')
                                .sort({folio:-1})
        }
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
            return res.status(404).json({msg:'Orden no encontrada'})
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

//Eliminar Orden
exports.deleteOrder = async (req,res) =>{
    try {
         //Revisar el ID
        let order = await Order.findById(req.params.id)

        // Si la orden existe o no
        if(!order){
            return res.status(404).json({msg:'Orden no encontrada'})
        }

        const {level} = await User.findById(req.user.id)
        
        if(level < 2){
            if(order.createdby.toString() !== req.user.id){
                return res.status(401).json({msg:'No tienes autorizacion para realizar esta accion'})
            }
        }
        
        // Eliminar orden
        await Order.findOneAndRemove({_id: req.params.id})
        res.json({msg: 'Orden eliminada con exito'})

    } catch (error) {
        console.log(error)
        res.status(500).send('Error en el servidor')
    }

}