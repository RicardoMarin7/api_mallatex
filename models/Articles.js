const mongoose = require('mongoose')

const ArticlesSchema = mongoose.Schema({
    code:{
        type:String,
        unique: true,
        require: true,
        trim: true
    },
    description:{
        type:String,
        require:true,
        trim: true
    },
    unit:{
        type:String,
        require:true,
        trim: true
    },
    line:{
        type:String,
        trim: true
    },
    price:{
        type:String,
        require:true,
        trim: true
    }
})

module.exports = mongoose.model('Articles', ArticlesSchema)