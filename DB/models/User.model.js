import { Schema ,model } from "mongoose";
import {systemRoles} from '../../src/utils/systemRoles.js'
const userSchema=new Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true
        },
        name:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            required:true,
        },
        role:{
            type:String,
            default:systemRoles.User,
            enum:[systemRoles.User,
                systemRoles.Admin],
        },
        phoneNumber:{
            type:String,
            required:true
        },
        verificationCode:{
            type:String
        },
        gender:{
            type:String,
            default:'Not specified',
            enum:['Male','Female' ,'Not specified']
        },
        // address:[AddressSchema],
        profilePicture:{
            secure_url:String,
            public_id:String
        },
        age:Number,
        customPath:String,
        usertoken:String,
        status:{
            type:String,
            default:'Offline',
            enum:['Offline','Online']
        },
        customId:String,
        confirmEmail:{
            type:Boolean,
            default:false
        },
        isVerified:{
            type:Boolean,
            default:false
        },
        identityId:{
            type:Schema.Types.ObjectId,
            ref:'Identity',
        },
        likedProperties:[{
            type:Schema.Types.ObjectId,
            ref:'Property',
        }]
    },{
        timestamps:true
    }
)
const userModel=model('User',userSchema)
export default userModel