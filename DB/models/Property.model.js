import { Schema, model } from "mongoose";

const propertySchema =new Schema({
    description:{type:String,required:true},
    type:{
        type:String,
        enum:['Appartment','Duplex','Room','Studio','Shop','Villa'],
        required:true
    }, 
    roomsNumber:{type:Number},
    bedrooms:{type:Number,required:true},
    bathrooms:{type:Number,required:true},
    addedBy:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    propertyImages:[{
            secure_url:{type:String,required:true},
            public_id:{type:String,required:true},
        }],
    area:{type:Number,required:true},
    level:{type:Number,required:true},
    isFurnished:{type:Boolean,required:true},
    essentials:{
        // balacony:{type:Boolean,default:false},
        // wifi:{type:Boolean,default:false},
        // naturalGas:{type:Boolean,default:false},
        // elevator:{type:Boolean,default:false},
        // privateGarden:{type:Boolean,default:false},
        // landLine:{type:Boolean,default:false},
        // kitchen:{type:Boolean,default:false}
        type:String,required:true
    },
//     SurroundingFacilities:[{
//         type:String,
//         // required:true,
//         lowercase:true,
//         // unique:false
// }],
    price:{type:Number,required:true},
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
    address:{type:String, required:true},
    location:{
        long:{type:Number, required:true},
        lat:{type:Number ,required:true}
    },
    customId:String,

},{
    timestamps:true
})

const propertyModel= model('Property',propertySchema)

export default propertyModel

