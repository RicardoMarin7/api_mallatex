const User = require('../models/Users')
const Article = require('../models/Articles')
const { validationResult } = require('express-validator')

exports.createArticle = async (req,res) =>{

    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()})
    }

    if(req.user.level < 2){
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

//Obtiene todos los articulos
exports.getArticles = async (req,res) =>{
    try {
        const articles = await Article.find().sort({code:-1})
        res.json({articles})
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}

//Actualizar Articulo
exports.updateArticle = async (req,res) =>{

    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()})
    }
    
    //Extraer informacion de articulo
    const {
        description,
        unit,
        line,
        price,
    } = req.body

    const newArticle = {}

    if(req.user.level < 2){
        return res.status(401).json({msg:'No tienes autorizacion para hacer este movimiento'})
    }

    if(description){ newArticle.description = description }
    if(unit){ newArticle.unit = unit }
    if(line){ newArticle.line = line }
    if(price){ newArticle.price = price }

    try {
        //Revisar el id
        let article = await Article.findById(req.params.id)

        //Revisar si existe el articulo
        if(!article){
            return res.status(404).json({msg:'Articulo no encontrado no encontrado'})
        }

        //actualizar
        article = await Article.findByIdAndUpdate({_id: req.params.id}, {$set: newArticle}, {new:true},)

        res.json({article})

    } catch (error) {
        console.log(error)
        res.status(500).send('Error en el servidor')
    }
}

//Eliminar Articulo
exports.deleteArticle = async (req,res) =>{
    try {
         //Revisar el ID
        let article = await Article.findById(req.params.id)

        // Si la orden existe o no
        if(!article){
            return res.status(404).json({msg:'Articulo no encontrado'})
        }
        
        if(req.user.level < 2){
            return res.status(401).json({msg:'No tienes autorizacion para realizar esta accion'})
        }
        
        // Eliminar Articulo
        await Article.findOneAndRemove({_id: req.params.id})
        res.json({msg: 'Articulo eliminado con exito'})

    } catch (error) {
        console.log(error)
        res.status(500).send('Error en el servidor')
    }

}