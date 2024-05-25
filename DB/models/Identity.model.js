import {Schema, model} from 'mongoose'

const identitySchema =new Schema({
    userId:{
            type:Schema.Types.ObjectId,
            ref:'User',
            unique:true,
            required:true,
    },
    nationalIdImages:[{   
    secure_url:{type:String,required:true},
    public_id:{type:String,required:true},
    }],
    cameraRollImage:{
        secure_url:{type:String,required:true},
        public_id:{type:String,required:true},
    },
    verifiedNumber:String,
    verificationStatus:{type:String,default:'not verified',enum:['under review','verified','not verified','rejected']}
})
const identityModel=model('Identity',identitySchema)
export default identityModel