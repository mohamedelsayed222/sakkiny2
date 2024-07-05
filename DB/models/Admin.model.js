import { Schema ,model } from "mongoose";
const adminSchema=new Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true
        },
        userName:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            required:true,
        },
        adminToken:String,
        confirmEmail:{
            type:Boolean,
            default:false
        },
        likedProperties:[{
            type:Schema.Types.ObjectId,
            ref:'Property',
        }],
        likedServices:[{
            type:Schema.Types.ObjectId,
            ref:'Service',
        }],
    },{
        timestamps:true
    }
)
const adminModel=model('Admin',adminSchema)
export default adminModel