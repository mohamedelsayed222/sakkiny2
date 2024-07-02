import { Schema, model } from "mongoose";
const reportSchema =new Schema({
    message:{type:String,require:true},
    subject:{type:String,},
    // createdBy:{
    //     type:Schema.Types.ObjectId,
    //     ref:'User',
    // },
    name:{
        type:String,
        required:true
    },
    reportImage:{
            secure_url:{type:String},
            public_id:{type:String},
        },
    email:{
        type:String,
        required:true
    },

    contactNumber:{
        type:String,
        required:true
    },
    // reportStatus:{
    //     type:String,
    //     enum:["checking","sent",'']
    // },
    response:{
        type:String
    },
    customId:{
        type:String
    }
    
},{timestamps:true})

const reportModel = model('Report',reportSchema)
export default reportModel