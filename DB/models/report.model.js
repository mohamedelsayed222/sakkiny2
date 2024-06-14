import { Schema, model } from "mongoose";
const reportSchema =new Schema({
    message:{type:String,require:true},
    reportedUserName:{
    type:String,
    required:true,
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    reportImage:{
            secure_url:{type:String,required:true},
            public_id:{type:String,required:true},
        },
    reportStatus:{
        type:String,
        enum:["checking","sent",'']
    },
    response:{
        type:String
    }
    
})