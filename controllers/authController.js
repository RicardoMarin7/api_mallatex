const User = require('../models/Users')
const Bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')
const JsonWebToken = require('jsonwebtoken')

exports.Login = async (req,res) =>{
    //Revisamos si hay errores
    const error = validationResult(req)

    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()})
    }

    //Extraer email y password
    const {email,password} = req.body

    try {
        //Revisar que sea un usuario registrado
        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({msg:'El usuario no existe'})
        }

        //Revisar el password
        const correctPassword = await Bcryptjs.compare(password,user.password)

        if(!correctPassword){
            return res.status(400).json({msg:'Password Incorrecto'})
        }

        //crear y firmar json web token
        const payload = {
            user:{
                id:user.id,
                level:user.level
            }
        }
        
        const base64Secret = Buffer.from(process.env.SECRET).toString('base64')

        //firmar Token
        JsonWebToken.sign(payload,process.env.SECRET,{
            expiresIn: 3600
        }, (error,token) =>{
            if(error) throw error
            //Mensaje de confirmacion de token creado correctamente
            res.json({
                    token: token,
                    msg:'Login Correcto'})
        })

    } catch (error) {
        console.log(error)
    }
}

//Obtiene el usuario autenticado
exports.userAuthenticated = async (req,res) =>{
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json({user})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:'Hubo un error'})
    }
}

