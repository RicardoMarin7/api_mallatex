const mongoose = require('mongoose')

const CountersSchema = mongoose.Schema({
    _id:{
        type:String,
        required: true
    },
    sequence_value:{
        type:Number,
        trim: true,
    }
})

module.exports = mongoose.model('Counter', CountersSchema)