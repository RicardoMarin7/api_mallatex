const Provider = require('../models/Providers')
const Counter = require('../models/Counters')
const User = require('../models/Users')

const { validationResult } = require('express-validator')


const getNextSecuenceValue = async () =>{
    const filter = { _id: 'providersfolio'}
    const update = {$inc:{sequence_value:1}}
    let nextSecuenceValue = await Counter.findOneAndUpdate(filter,update)
    return nextSecuenceValue.sequence_value
}

exports.createProvider = async (req,res) =>{

    const error = validationResult(req)

    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()})
    }

//    const {level} = await User.findById(req.user.id)

    if(req.user.level < 2){
        return res.status(401).json({msg:'No tienes autorizacion para hacer este movimiento'})
    }

    try {
        //Crear una nuevo proveedor
        const provider = new Provider(req.body)
        //Guardar creador via json web token
        provider.code = await getNextSecuenceValue()
        await provider.save()
        res.json(provider)
    } catch (error) {
        console.log(error)
        res.status(500).send(`Error:${error.message}`)
    }
}

//Obtiene todos los proveedores
exports.getProviders = async (req,res) =>{
    try {
        const provider = await Provider.find().populate().sort({folio:-1})
        res.json({provider})
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}

//Actualizar Proveedor
exports.updateProvider = async (req,res) =>{

    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()})
    }
    
    //Extraer informacion de articulo
    const {
        name,
        address,
        phone,
        email,
    } = req.body

    const newProvider = {}

    if(req.user.level < 2){
        return res.status(401).json({msg:'No tienes autorizacion para hacer este movimiento'})
    }

    if(name){ newProvider.name = name }
    if(address){ newProvider.address = address }
    if(phone){ newProvider.phone = phone }
    if(email){ newProvider.email = email }

    try {
        //Revisar el id
        let provider = await Provider.findById(req.params.id)

        //Revisar si existe el articulo
        if(!provider){
            return res.status(404).json({msg:'Articulo no encontrado no encontrado'})
        }

        //actualizar
        provider = await Provider.findByIdAndUpdate({_id: req.params.id}, {$set: newProvider}, {new:true},)

        res.json({provider})

    } catch (error) {
        console.log(error)
        res.status(500).send('Error en el servidor')
    }
}

//Eliminar Proveedor
exports.deleteProvider = async (req,res) =>{
    try {
         //Revisar el ID
        let provider = await Provider.findById(req.params.id)

        // Si la orden existe o no
        if(!provider){
            return res.status(404).json({msg:'Proveedor no encontrado'})
        }

        //const {level} = await User.findById(req.user.id)
        //console.log(req.user)
        
        if(req.user.level < 2){
            return res.status(401).json({msg:'No tienes autorizacion para realizar esta accion'})
        }
        
        // Eliminar orden
        await Provider.findOneAndRemove({_id: req.params.id})
        res.json({msg: 'Proveedor eliminado con exito'})

    } catch (error) {
        console.log(error)
        res.status(500).send('Error en el servidor')
    }

}