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
    requestedby:{
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
    shipping_conditions:{
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
    articles:[{
                article:{type: mongoose.Types.ObjectId , ref:'Articles'},
                quantity:{type:Number, required:true},
                price:{type:Number,required:true},
                import:{type:Number,required:true},
                }    
    ],
    requisitionFolio:{
        type: Number,
        required:true,
    },
    iva:{
        type:Number,
        required:true
    }, 
    total:{
        type:Number,
        required:true
    },
    subtotal:{
        type:Number,
        required:true
    },
    shipping_cost:{
        type:Number,
        trim:true
    },
    other_spending:{
        type:Number,
        trim:true
    },
    comments:{
        type:String,
        trim:true
    }
})

module.exports = mongoose.model('Orders', OrdersSchema)