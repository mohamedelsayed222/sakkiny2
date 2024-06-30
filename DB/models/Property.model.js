import { Schema, model } from "mongoose";

const propertySchema =new Schema({
    description:{type:String,required:true},
    type:{
        type:String,
        enum:['apartment','duplex','room','studio','shop','villa'],
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
    userVerified:{type:Boolean,default:true},
    addedByType:{
        type:String,
        default:'owner',
        enum:['owner','broker','real state company','government agencies'
        ]},
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
        enum:['daily','weekly','monthly','yearly'],
        default:'monthly'
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
    latitude:{type:Number ,required:true},
    longitude:{type:Number, required:true},
    // {type:LocationSchema,required:true},

    address:{type:String,required:true},
    customId:String,
    likesCount:{type:Number,default:0}


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

//   export const LocationSchema=new Schema({
//     type:{type:String,enum: ["Point"],default:'Point'},
//     coordinates:[{type:Number,required:true}]
//   })



