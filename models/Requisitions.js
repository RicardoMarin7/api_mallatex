const mongoose = require('mongoose')

const RequisitionsSchema = mongoose.Schema({
    folio:{
        type: Number,
        trim: true,
        required: true
    },
    createdby:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    creationdate:{
        type:Date,
        trim:true,
        default:Date.now()
    },
    state:{
        type:String,
        trim:true,
        default:'pendiente'
    },
    comments:{
        type:String,
        trim:true,
    },
    reviewed:{
        type:Boolean,
        default:false
    },
    articles:[{
                article:{type: mongoose.Types.ObjectId , ref:'Articles'},
                quantity:{type:Number, required:true},
                inStock:{type:Boolean,default:'false'}
        }
    ],
    client:{
        type:String,
        trim:true
    },
    sendTo:{
        type:String,
        trim:true
    }
})

module.exports = mongoose.model('Requisitions', RequisitionsSchema)