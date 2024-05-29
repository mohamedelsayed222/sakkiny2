import { Schema, model } from "mongoose";
import { LocationSchema } from "./location.schema.js";

const propertySchema =new Schema({
    description:{type:String,required:true},
    type:{
        type:String,
        enum:['appartment','duplex','room','studio','shop','villa'],
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
    level:{type:String,required:true},
    isFurnished:{type:Boolean,required:true},
    essentials:{
        balcony:{type:Boolean,default:false},
        wifi:{type:Boolean,default:false},
        naturalGas:{type:Boolean,default:false},
        elevator:{type:Boolean,default:false},
        privateGarden:{type:Boolean,default:false},
        landLine:{type:Boolean,default:false},
        kitchen:{type:Boolean,default:false},
        parking:{type:Boolean,default:false},
        conditioning:{type:Boolean,default:false},
        electricityMeter:{type:Boolean,default:false},
        waterMeter:{type:Boolean,default:false}
        },
//     SurroundingFacilities:[{
//         type:String,
//         lowercase:true,

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
    // address:{type:String, required:true},
    location:{type:LocationSchema,required:true},
    customId:String,
    likesCount:{type:Number,}

},{
    timestamps:true
})

const propertyModel= model('Property',propertySchema)

export default propertyModel
/////////////////////////////////////////////////////////////////






// import { Schema } from "mongoose";

// export const AddressSchema = new Schema({
//     street: String,
//     buildingNumber:Number,
//     village:{type:String},
//     city: {type:String,required:true},
//     country: {type:String,default:'Egypt',required:true},
//   });

//   export const LocationScema=new Schema({
//     type:{type:String,enum: ["Point"],default:'Point'},
//     coordinates:[{type:Number,required:true}]
//   })



