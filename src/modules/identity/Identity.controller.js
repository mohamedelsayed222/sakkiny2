import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('123456789', 6)
import sendSMS from '../../services/sendsms.js'
import identityModel from '../../../DB/models/Identity.model.js'
import cloudinary from '../../utils/cloudinaryconfig.js'

export const sendVerificationNumber=async(req,res,next)=>{
    const user=req.user

    const phoneNumber=user.phoneNumber
    if(!phoneNumber){
        return next(new Error("Unexpected Error"))
    }
    if(user.isVerified){
        return next(new Error("you are already verified"))
    }
    const code =nanoid()

    const identity= await identityModel.findOne({userId:user._id})
    if(identity){
    // req.body.phoneNumber||req.body.phoneNumber!=user.phoneNumber)&&
    if(identity?.phoneNumberVerification.verified){
            return next (new Error('Your phone number is already verified')) 
    }
    if(identity?.verificationCode){
        return next (new Error('Check your SMS')) 
        //TODO Dont recieve sms api  update verification code 
}

identity.phoneNumberVerification.phoneNumber=user.phoneNumber
identity.verificationCode=code
await identity.save()
}
//test
// if(!identity){
await identityModel.create({verificationCode:code,userId:user._id,verificationCode:code,'phoneNumberVerification.phoneNumber':phoneNumber})
// }
    const sent=await sendSMS({to:phoneNumber,text:`Welcome from Sakkiny your verification code is 
        ${code}
    Thank you  
    `})
    if(!sent){
        return next (new Error('Try again later')) 
    }
    return res.json({status:true,message:"Message Sent "})
}



export const verifyIdentity=async(req,res,next)=>{
    const user=req.user
    const {code}=req.body
    const identity=await identityModel.findOne({userId:user._id})
    if(!identity){
        return next(new Error("Unexpected Error"))
    }
    if(user.isVerified){
        return next (new Error('Your are already verified')) 
    }
    if(!identity.verificationCode){
        return next(new Error("Send Sms First"))
    }
    // if(identity.phoneNumberVerification.verified){
    //     return next (new Error('Your phone number is already verified')) 
    // 

    if(!code){
        return next(new Error("Please Enter the code"))
    }
    if(code!=identity.verificationCode){
        return next(new Error("Code is incorrect please"))
    }
    identity.phoneNumberVerification.verified=true
/////////////////////////////////////////////////////////////////////
if(!Object.keys(req.files).length==3){
    return next(new Error("Please upload the required images"))
}
if(!user.customId){
    const customId = nanoid()
    user.customId=customId
    await user.save()
}
if(identity.identityImages.length){
    return next(new Error("Your request is under revision"))
}
    // const customId = nanoid()
    const identityImages = []
    const publicIds = []
    const identityFolder=`${process.env.PROJECT_FOLDER}/user/${user.customId}/Identity/`
    // console.log(req.files);
    for (const file in req.files) {
        for(let ele of req.files[file]){
        console.log(ele);
        console.log(req.files[file][0]);
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        ele.path,
        {
          folder:identityFolder 
        },
      )
      identityImages.push({ secure_url, public_id })
      publicIds.push(public_id)
    }
}
identity.identityImages=identityImages
    await identity.save()
    return res.json({status:true,message:"Your request will be reviewed Thanks!"})
}




// export const verifyNumber=async(req,res,next)=>{
//     const user=req.user
//     const {code}=req.body
//     const identity=await identityModel.findOne({userId:user._id})
//     if(!identity){
//      return next(new Error("Unexpected Error"))
//     }
//     if(identity.phoneNumberVerification.verified){
//         return next (new Error('Your phone number is already verified')) 
//     }
//     if(!identity.verificationCode){
//         return next(new Error("Send Sms First"))
//        }
//     if(!code){
//         return next(new Error("Please Enter the code"))
//     }
//     if(code==identity.verificationCode){
//         identity.phoneNumberVerification.verified=true
//         await identity.save()
//     return res.json({status:true,message:"Your number is verified"})
//     }
//     return next(new Error("Code is incorrect please"))
// }



// export const sendVerificationNumber=async(req,res,next)=>{
//     const user=req.user
//     // const {changeNumber}=req.body
//     // if(req.body.phoneNumber){
//     //     user.phoneNumber=req.body.phoneNumber
//     //     await user.save();
//     // } 
//     const phoneNumber=user.phoneNumber
//     if(!phoneNumber){
//         return next(new Error("Unexpected Error"))
//     }
//     const code =nanoid()
//     // console.log(identity.us);
  

    
//     const identity= await identityModel.findOne({userId:user._id})
//     if(identity){
//     // req.body.phoneNumber||req.body.phoneNumber!=user.phoneNumber)&&
//     if(identity?.phoneNumberVerification.verified){
//             return next (new Error('Your phone number is already verified')) 
//     }
//     if(identity?.verificationCode){
//         return next (new Error('Check your SMS')) 
//         //TODO Dont recieve sms api  update verification code 
// }
// identity.phoneNumberVerification.phoneNumber=user.phoneNumber
// identity.verificationCode=code
// await identity.save()
// }
// if(!identity){
//     await identityModel.create({verificationCode:code,userId:user._id,verificationCode:code,'phoneNumberVerification.phoneNumber':phoneNumber})
// }
//     const sent=await sendSMS({to:phoneNumber,text:`
//     Welcome from Sakkiny your verification code is ${code}
//     Thank you  
//     `})
//     if(!sent){
//         return next (new Error('Try again later')) 
//     }
//     return res.json({status:true,message:"Message Sent "})
// }

