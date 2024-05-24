import { Schema, model } from "mongoose";


const serviceSchema=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    serviceCategory:{
        type:String,
        required:true,
        enum:['plumbing','electrical','painting','carpentry','cleaning','cooking','appliances','delivering','guarding']
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },

})