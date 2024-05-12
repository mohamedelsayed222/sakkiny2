import { Schema, model } from "mongoose";
import { AddressSchema, LocationScema } from "./Address.schema.js";


const propertySchema =new Schema({
    description:{type:String,required:true},
    title:{type:String},
    type:{
        type:String,
        enum:['Appartment','Duplex','Room','Studio','Shop','Villa']
    }, 
    addedBy:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    propertyImages:[{
            secure_url:{type:String,required:true},
            public_id:{type:String,required:true},
        }],
    size:{type:Number,required:true},
    level:{type:Number,required:true},
    roomsNumber:{type:Number,required:true},
    isFurnished:{type:Boolean,required:true},
    details:{
        balacony:{type:Boolean,default:false},
        wifi:{type:Boolean,default:false},
        naturalGas:{type:Boolean,default:false},
        elevator:{type:Boolean,default:false},
        privateGarden:{type:Boolean,default:false},
        landLine:{type:Boolean,default:false},
    },
    SurroundingFacilities:[{
        type:String,
        required:true,
        lowercase:true,
        unique:false
}],
    price:Number,
    per:{
        type:String,
        enum:['night','day','week','month','year'],
        default:'month'
    },
    numberOfGuests:{
        type:String,
        default:'Not required',
        enum:['1','2','3','4','5','6','+6','Not required']
    },
    propertyStatus:{
        type:String,
        default:'Available',
        enum:['Available','Booked']
    },
    address:AddressSchema,
    location:LocationScema,
    customId:String,

},{
    timestamps:true
})

const propertyModel= model('Property',propertySchema)

export default propertyModel

