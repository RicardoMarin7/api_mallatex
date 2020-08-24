const mongoose = require('mongoose')

const UsersSchema = mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
        trim:true
    },
    level:{
        type: Number,
        default:1
    },
    date:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model('User', UsersSchema)