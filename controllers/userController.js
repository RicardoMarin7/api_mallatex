const User = require('../models/Users')
const Bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')
const JsonWebToken = require('jsonwebtoken')

exports.CreateUser = async (req,res) => {

    //Revisamos si hay errores
    const error = validationResult(req)

    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()})
    }

    const { email, password} = req.body

    try {
        let user = await User.findOne({ email })
        
        if(user){
            return res.status(400).json({ msg: 'El usuario ya existe'})
        }

        //Crea el nuevo usuario
        user = new User(req.body)

        //Hash password
        const salt = await Bcryptjs.genSalt(10);
        user.password = await Bcryptjs.hash(password,salt)

        //crear y firmar json web token
        const payload = {
            user:{
                id:user.id,
                level:user.level
            }
        }
        
        const base64Secret = Buffer.from(process.env.SECRET).toString('base64')
        console.log(base64Secret)

        //firmar Token
        JsonWebToken.sign(payload,process.env.SECRET,{
            expiresIn: 3600
        }, (error,token) =>{
            if(error) throw error
            //Mensaje de confirmacion de token creado correctamente
            res.json({
                    token: token,
                    msg:'Usuario creado correctamente'})
        })

        //Se guarda el usuario en la base de datos
        await user.save()
    } catch (error) {
        console.log(error)
        res.status(400).send('Existe un error al insertar el registro')
    }
}