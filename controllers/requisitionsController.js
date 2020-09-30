const Requisition = require('../models/Requisitions')
const Counter = require('../models/Counters')
const User = require('../models/Users')
const Article = require('../models/Articles')

const { validationResult } = require('express-validator')


const getNextSecuenceValue = async () =>{
    const filter = { _id: 'requisitionsfolio'}
    const update = {$inc:{sequence_value:1}}
    let nextSecuenceValue = await Counter.findOneAndUpdate(filter,update)
    return nextSecuenceValue.sequence_value
}

const getArticle = async (id) =>{
    const article = await Article.findById(id)
    return article
}

exports.createRequisition = async (req,res) =>{
    const error = validationResult(req)

    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()})
    }    

    try {
        //Crear una nueva orden
        const requisition = new Requisition(req.body)
        //Guardar creador via json web token
        requisition.createdby = req.user.id
        requisition.folio = await getNextSecuenceValue()
        
        //Iteramos cada articulo y verificamos que exista

        for(let i=0;i<requisition.articles.length;i++){
            const article = await getArticle(requisition.articles[i].article)
            if(!article){
                return res.status(404).json({msg:`El articulo con el id:${requisition.articles[i].article} no fue encontrado`})
            }
        }

        await requisition.save()
        res.json(requisition)
    } catch (error) {
        console.log(error)
        res.status(500).send(`Error:${error.message}`)
    }
}

//Obtiene todas las ordenes del usuario actual
exports.getRequisitions = async (req,res) =>{
    try {
        let requisitions
        if(req.user.level < 2){
            requisitions = await Requisition
                                .find({ createdby: req.user.id })
                                .populate({ path:"articles.article"})
                                .populate('createdby','-password')
                                .populate('reviewedby','-password')
                                .populate('stateby','-password')
                                .sort({folio:-1})
        }
        else{
            requisitions = await Requisition
                                .find()
                                .populate({ path:"articles.article"})
                                .populate('createdby','-password')
                                .populate('reviewedby','-password')
                                .populate('stateby','-password')
                                .sort({folio:-1})
        }
        
        res.json({requisitions})
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}

exports.getAproved = async (req,res) =>{
    try {
        let requisitions
        if(req.user.level > 2){
            requisitions = await Requisition
                                .find({ reviewed: 'true', state:'aprobada' })
                                .populate({ path:"articles.article"})
                                .populate({ path:"reviewedArticles.article"})
                                .populate('createdby','-password')
                                .populate('reviewedby','-password')
                                .populate('stateby','-password')
                                .sort({folio:-1})
        }
        else{
            return res.status(401).json({msg:'No tienes autorizacion para hacer este movimiento'})
        }
        res.json({requisitions})
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}

//Actualizar Orden
exports.updateRequisition = async (req,res) =>{

    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()})
    }

    const {level} = await User.findById(req.user.id)
    
    //Extraer informacion de proyecto
    const {
        comments,
        reviewed,
        state,
        reviewedArticles,
        reviewedby
    } = req.body

    const  newRequisition = {}

    if(comments){  newRequisition.comments = comments }

    if(reviewed){
        if(level < 2){
            return res.status(401).json({msg:'No tienes autorizacion para hacer este movimiento'})
        }
        newRequisition.reviewed = reviewed
    }

    if(reviewedArticles){
        if(level < 2){
            return res.status(401).json({msg:'No tienes autorizacion para hacer este movimiento'})
        }
        newRequisition.reviewedArticles = reviewedArticles
    }

    if(reviewedArticles){
        if(level < 2){
            return res.status(401).json({msg:'No tienes autorizacion para hacer este movimiento'})
        }
        newRequisition.reviewedby = reviewedby
    }

    if(state){
        if(level < 2){
            return res.status(401).json({msg:'No tienes autorizacion para hacer este movimiento'})
        }
        newRequisition.state = state
    }

    try {
        //Revisar el id
        let requisition = await Requisition.findById(req.params.id)

        //Revisar si existe la orden
        if(!requisition){
            return res.status(404).json({msg:'Requisicion no encontrada'})
        }

        //actualizar
        requisition = await Requisition.findByIdAndUpdate({_id: req.params.id}, {$set: newRequisition}, {new:true},)

        res.json({requisition})

    } catch (error) {
        console.log(error)
        res.status(500).send('Error en el servidor')
    }
}

//Eliminar Orden
exports.deleteRequisition = async (req,res) =>{
    try {
         //Revisar el ID
        let requisition = await Requisition.findById(req.params.id)

        // Si la orden existe o no
        if(!requisition){
            return res.status(404).json({msg:'Requisicion no encontrada'})
        }

        const {level} = await User.findById(req.user.id)
        
        if(level < 2){
            if(requisition.createdby.toString() !== req.user.id){
                return res.status(401).json({msg:'No tienes autorizacion para realizar esta accion'})
            }
        }
        
        // Eliminar orden
        await Requisition.findOneAndRemove({_id: req.params.id})
        res.json({msg: 'Requisicion eliminada con exito'})

    } catch (error) {
        console.log(error)
        res.status(500).send('Error en el servidor')
    }

}