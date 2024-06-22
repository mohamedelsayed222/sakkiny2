import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('123456789', 6)
import sendSMS from '../../services/sendsms.js'
import identityModel from '../../../DB/models/Identity.model.js'

export const sendVerificationNumber=async(req,res,next)=>{
    const user=req.user

    // const {changeNumber}=req.body
    // if(req.body.phoneNumber){
    //     user.phoneNumber=req.body.phoneNumber
    //     await user.save();
    // }
    
    const phoneNumber=user.phoneNumber
    if(!phoneNumber){
        return next(new Error("Unexpected Error"))
    }
    const code =nanoid()
    // console.log(identity.us);
    
    
    const identity= await identityModel.findOneAndUpdate({userId:user._id},{verificationCode:code,'phoneNumberVerification.phoneNumber':phoneNumber})
    if(!identity){
        await identityModel.create({verificationCode:code,userId:user._id,verificationCode:code,'phoneNumberVerification.phoneNumber':phoneNumber})
    }
    // req.body.phoneNumber||req.body.phoneNumber!=user.phoneNumber)&&
    if(identity?.phoneNumberVerification.verified){
            return next (new Error('Your phone number is already verified')) 
    }
    if(identity?.verificationCode){
        return next (new Error('Check your SMS')) 
        //TODO Dont recieve sms api  update verification code 
}
    const sent=await sendSMS({to:phoneNumber,text:`
    Welcome from Sakkiny your verification code is ${code}
    Thank you  
    `})
    // console.log("******************************************************");
    // console.log(sent);
    if(!sent){
        return next (new Error('Try again later')) 
    }
    return res.json({status:true,message:"Message Sent "})
}

export const verifyNumber=async(req,res,next)=>{
    const user=req.user
    const {code}=req.body
    const identity=await identityModel.findOne({userId:user._id})
    if(!identity){
     return next(new Error("Unexpected Error"))
    }
    if(identity.phoneNumberVerification.verified){
        return next (new Error('Your phone number is already verified')) 
    }
    if(!identity.verificationCode){
        return next(new Error("Send Sms First"))
       }
    if(!code){
        return next(new Error("Please Enter the code"))
    }
    if(code==identity.verificationCode){
        identity.phoneNumberVerification.verified=true
        await identity.save()
    return res.json({status:true,message:"Your number is verified"})
    }
    return next(new Error("Code is incorrect please"))
}


export const uploadCameraImage=async(req,res,next)=>{
    const user=req.user
    if(!req.file){
        return next (new Error("upload a picture",{cause:400}))
    }
    const customId=nanoid()
   
    const data =await cloudinary.uploader.upload(req.file.path,
        {
            folder: `${process.env.PROJECT_FOLDER}/user/${user.customId || customId}/profilePicture`,
        }
    )
    const {secure_url,public_id}=data
    user.profilePicture={secure_url,public_id}
    if(!user.customId){
    user.customId=customId
        }
    await user.save()
    return res.status(201).json({message:"Done",user})

}
