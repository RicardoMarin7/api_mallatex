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
    stateby:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    comments:{
        type:String,
        trim:true,
    },
    reviewed:{
        type:Boolean,
        default:false
    },
    reviewedby:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    articles:[{
                article:{type: mongoose.Types.ObjectId , ref:'Articles'},
                quantity:{type:Number, required:true},
        }
    ],
    reviewedArticles:[{
                article:{type: mongoose.Types.ObjectId , ref:'Articles'},
                quantity:{type:Number, required:true},
            }
    ],
    client:{
        type:String,
        trim:true
    },
    sendTo:{
        type:String,
        trim:true
    },
    converted:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model('Requisitions', RequisitionsSchema)