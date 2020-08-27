const mongoose = require('mongoose')

const ProvidersSchema = mongoose.Schema({
    code:{
        type:Number,
        unique: true,
        require: true,
        trim: true
    },
    name:{
        type:String,
        require:true,
        trim: true
    },
    address:{
        type:String,
        require:true,
        trim: true
    },
    phone:{
        type:Number,
        trim: true
    },
    email:{
        type:String,
        trim: true
    },
    date:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model('Provider', ProvidersSchema)