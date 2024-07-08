import {Schema, model} from 'mongoose'

const identitySchema =new Schema({
    userId:{
            type:Schema.Types.ObjectId,
            ref:'User',
            unique:true,
            required:true,
    },

    phoneNumberVerification:{
        phoneNumber:{type:String},
        verified:{type:Boolean,default:false},
    },
    verificationCode:{type:String},
    identityImages:[{
        secure_url:{type:String},
        public_id:{type:String},
    }],
    identityVerified:{type:Boolean,default:false},
})
const identityModel=model('Identity',identitySchema)
export default identityModel