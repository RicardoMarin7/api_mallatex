const mongoose = require('mongoose')

const OrdersSchema = mongoose.Schema({
    folio:{
        type: Number,
        trim: true,
        required: true
    },
    provider:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Provider',
    },
    createdby:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sentvia:{
        type:String,
        trim:true,
        default:''
    },
    fob:{
        type:String,
        trim:true,
        default:''
    },
    sendemployee:{
        type:String,
        trim:true,
        default:''
    },
    currency:{
        type:String,
        required:true,
        trim:true
    },
    creationdate:{
        type:Date,
        trim:true,
        default:Date.now()
    },
    boughtdate:{
        type:Date,
        trim:true,
        default:Date.now()
    },
    state:{
        type:String,
        trim:true,
        default:'pending'
    },
    articles:[
        {type: mongoose.Types.ObjectId , ref:'Articles'}
    ]
})

module.exports = mongoose.model('Orders', OrdersSchema)