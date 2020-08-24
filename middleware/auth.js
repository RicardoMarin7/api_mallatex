const JsonWebToken = require('jsonwebtoken')

module.exports = function (req,res,next){
    //Leer token
    const token = req.header('x-auth-token')

    //Revisar si no hay token
    if(!token){
        return res.status(401).json({msg:'El usuario no esta autenticado'})
    }

    //validar token
    try {
        const cypher = JsonWebToken.verify(token,process.env.SECRET)
        req.user = cypher.user
        next()
    } catch (error) {
        res.status(401).json({msg:'Token Invalido, vuelva a iniciar sesion'})
    }

}