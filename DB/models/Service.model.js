import { Schema, model } from "mongoose";
import { LocationSchema } from "./location.schema.js";


const serviceSchema=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    serviceCategory:{
        type:String,
        required:true,
        enum:['plumbing','electrical','painting','carpentry',
        'cleaning','cooking','appliances','delivering','guarding',
        'nursing','interior design','nannies','dry cleaning','security']
    },
    description:{
        type:String,
        required:true
    },
    title:{
        type:String,
    },
    price:{
        type:Number,
        required:true
    },
    images:[{
        secure_url:{type:String,required:true},
        public_id:{type:String,required:true},
    }],
    
    // address:{type:String, required:true},
    location:LocationSchema,
    country:String,
    city:String,
    customId:String,
},{
    timestamps:true,
})

const serviceModel=model("Service",serviceSchema)
export default serviceModel