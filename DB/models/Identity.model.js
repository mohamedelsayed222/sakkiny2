import {Schema, model} from 'mongoose'

const identitySchema =new Schema({
    userId:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true,
    },
    nationalIdImages:[{   
    secure_url:{type:String,required:true},
    public_id:{type:String,required:true},
    }],
    cameraRollImage:{
        secure_url:{type:String,required:true},
        public_id:{type:String,required:true},
    }
})