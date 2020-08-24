const User = require('../models/Users')
const Article = require('../models/Articles')
const { validationResult } = require('express-validator')

exports.createArticle = async (req,res) =>{

    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()})
    }

    const {level} = await User.findById(req.user.id)

    if(level < 2){
        return res.status(401).json({msg:'No tienes autorizacion para hacer este movimiento'})
    }
    
    try {
        //Crear un nuevo articulo
        const article = new Article(req.body)
        await article.save()
        res.json(article)
    } catch (error) {
        console.log(error)
        res.status(500).send(`Error ${error.message}`)
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

//Eliminar Orden
exports.deleteOrder = async (req,res) =>{
    try {
         //Revisar el ID
        let order = await Order.findById(req.params.id)

        // Si la orden existe o no
        if(!order){
            return res.status(404).json({msg:'Proyecto no encontrado'})
        }

        const {level} = await User.findById(req.user.id)
        
        if(level < 2){
            console.log("entro")
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