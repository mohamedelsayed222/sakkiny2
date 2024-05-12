import { Schema ,model } from "mongoose";
import { AddressSchema } from "./Address.schema.js";
import { systemRoles } from "../../src/utils/systemRoles.js";

const userSchema=new Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true
        },
        firstName:{
            type:String,
        },
        lastName:{
            type:String,
        },
        password:{
            type:String,
            required:true,
        },
        role:{
            type:String,
            default:systemRoles.User,
            enum:[systemRoles.User,
                systemRoles.Owner,
                systemRoles.Admin,
                systemRoles.Service_provider,
                systemRoles.Super_admin],
        
        },
        phoneNumber:{
            type:String,
            required:true
        },
        gender:{
            type:String,
            default:'Not specified',
            enum:['Male','Female' ,'Not specified']
        },
        address:[AddressSchema],
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
        forgetCode: String,
        customId:String,
        confirmEmail:{
            type:Boolean,
            default:false
        },
        isVerified:{
            type:Boolean,
            default:false
        },
        userCurrentLocation:{

        },
    },{
        timestamps:true
    }
)
const userModel=model('User',userSchema)
export default userModel