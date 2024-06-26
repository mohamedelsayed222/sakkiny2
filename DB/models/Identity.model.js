import {Schema, model} from 'mongoose'

const identitySchema =new Schema({
    userId:{
            type:Schema.Types.ObjectId,
            ref:'User',
            unique:true,
            required:true,
    },
    nationalIdImages:[{   
    secure_url:{type:String},
    public_id:{type:String},
    }],
    phoneNumberVerification:{
        phoneNumber:{type:String},
        verified:{type:Boolean,default:false},
    },
    verificationCode:{type:String},
    identityImages:[{
        secure_url:{type:String},
        public_id:{type:String},
    }],
    // phoneNumberVerified:{type:Boolean,default:false},
    identityVerification:{type:Boolean,default:false},

    verificationStatus:{type:String,default:'not verified',enum:['under review','verified','not verified','rejected']}

})
const identityModel=model('Identity',identitySchema)
export default identityModel