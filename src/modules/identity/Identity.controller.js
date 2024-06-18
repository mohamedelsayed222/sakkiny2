import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('123456789', 6)
import sendSMS from '../../services/sendsms.js'
import identityModel from '../../../DB/models/Identity.model.js'

export const sendVerificationNumber=async(req,res,next)=>{
    const user=req.user
    const {phoneNumber}=req.body
    if(!phoneNumber){
        return next(new Error("Please Enter your phone number"))
    }
    const code =nanoid()
    const identity=await identityModel.create({verificationCode:code,userId:user._id})
    const sent=sendSMS({to:phoneNumber,text:`
    Wecome from Sakkiny your verification code is ${code}
    Thank you  
    `})
    if(!sent){
        return next (new Error('Try again later')) 
    }
    return res.json({status:true,message:"Message Sent "})
}


