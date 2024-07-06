import adminModel from "../../../DB/models/Admin.model.js"
import identityModel from "../../../DB/models/Identity.model.js"
import propertyModel from "../../../DB/models/Property.model.js"
import serviceModel from "../../../DB/models/Service.model.js"
import reportModel from "../../../DB/models/report.model.js"
import bcrypt from 'bcryptjs'
import  sendEmail  from '../../services/sendEmailService.js';
import { generateToken, verifyToken } from '../../utils/tokenFunctions.js';
import { ApiFeatures } from "../../utils/apiFeatures.js"
import userModel from "../../../DB/models/User.model.js"


export const signup=async(req,res,next)=>{
        const {
            userName,
            email,
            password,
        }=req.body
        const checkEmail=await adminModel.findOne({email})
        if(checkEmail){
        return next(new Error("Email exist" ,{cause:200}))
        }
        const hashpassword=bcrypt.hashSync
        (password,parseInt(process.env.SALT_ROUND)) 
        const token=generateToken({
            payload:{email:email},
            signature:process.env.EMAIL_SIGNATURE,
            expiresIn:60*60*24
        })
            const link =`${req.protocol}://${req.headers.host}/admin/confirmEmail/${token}`
            // const resendLink=`${req.protocol}://${req.headers.host}/auth/resendConfirmEmail/${retoken}`
            const html=`<!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sakinny</title>
            </head>
            <body>
              <div style="text-align: center; margin-top: 20px;">
                <h1>Welcome to Sakinny!</h1>
                <p>Please confirm your email address.</p>
                <button style="background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">
                <a href="${link}" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff ; text-decoration: none; text-decoration: none; padding: 15px 25px; border-radius: 2px; display: inline-block;">Activate Account</a> 
                </button>
              </div>
            </body>
            </html>`
            await sendEmail({to:email,subject:"confirmation",html})     
        const admin=await adminModel.create({
            userName,
            email,
            password:hashpassword,
        })
        if(!admin){
            return next (new Error('try again later',{cause:500}))
        }
        return res.status(201).json({status:true,message:"You have been signed up successfully, please activiate your gmail account"})
    }
    
export const confirmEmail=async(req,res,next)=>{
        const {token}=req.params
        const decoded=verifyToken({token,signature:process.env.EMAIL_SIGNATURE})
        const user =await adminModel.findOneAndUpdate(
            {email:decoded.email},
            {confirmEmail:true},
            {new:true})
        return user ? res.send("Your Email Confirmed Go to login page")
        : res.send(`<a href="${req.protocol}://${req.headers.host}/admin/signup">
        ooops you look like you don't sign up follow me to sign up
        </a>`)
    }
    

export const login=async(req,res,next)=>{
        const {email,password}=req.body
        console.log({email,password});
        const admin=await adminModel.findOne({email})
        if(!admin){
        return next(new Error("Invalid Email email does not exist ",{cause:200}))
            }
        const match=bcrypt.compareSync(password,admin.password)
        if(!match){
        return next(new Error("Invalid login data",{cause:200}))
        }
    
        if(admin.confirmEmail==false){
        return next(new Error("Please Confirm Your Email",{cause:200}))
        }
        const token=generateToken({
            payload:{
                email:admin.email,
                userName:admin.userName,
                id:admin._id,
                islogged:true
            },
            signature:process.env.TOKEN_SIGNATURE,
            // expiresIn:60*60*24
    
        })
        if(!token){
            return next(new Error("Payload is required",{cause:200}))
        }
        admin.adminToken=token 
        await admin.save()
        return res.status(200).json({status:true,message:"You have been logged in successfully",data:admin})
    }

export const getProperties=async(req,res,next)=>{
            const apiFeaturesInstance=new ApiFeatures( propertyModel.find() 
            .populate({path:'addedBy',
                select:'email name phoneNumber gender status profilePicture -_id'})
            ,req.query)
            .select()
            // .pagination()
                const properties=await apiFeaturesInstance.mongooseQuery
                if(!properties.length){
                    return next (new Error('There are no uploaded properties'))
                }
                return res.status(200).json({status:true,message:"Done",properties})
    }
        
export const getServices=async(req,res,next)=>{
            const user=req.user
            const apiFeaturesInstance=new ApiFeatures( serviceModel.find()
            .populate({path:'userId',
                select:'email name phoneNumber gender status profilePicture -_id'})
            ,req.query)
            .select()
            // .pagination()
                const services=await apiFeaturesInstance.mongooseQuery
                if(!services.length){
                    return next (new Error('No Service'))
                }
                return res.status(200).json({status:true,message:"Done",services})
    }

export const getAllIdentities=async(req,res,next)=>{
    const apiFeaturesInstance=new ApiFeatures( identityModel.find()
    .populate({path:'userId',
        select:'email name phoneNumber gender status profilePicture -_id'})
    ,req.query)
    .select()
    // .pagination()
        const identities=await apiFeaturesInstance.mongooseQuery
        if(!identities.length){
            return next (new Error('There are no identities to show'))
        }
        return res.status(200).json({status:true,message:"Done",identities})
    }

//////////////////////////////////////
export const getUnverifiedIdentities=async(req,res,next)=>{
    const apiFeaturesInstance=new ApiFeatures( identityModel.find({identityVerified:false})
    .populate({path:'userId',
        select:'email name phoneNumber gender status profilePicture -_id'})
    ,req.query)
    .select()
    .pagination()
        const identities=await apiFeaturesInstance.mongooseQuery
        if(!identities.length){
            return next (new Error('There are no identities to show'))
        }
        return res.status(200).json({status:true,message:"Done",identities})
}


export const getUsers=async(req,res,next)=>{
    const apiFeaturesInstance=new ApiFeatures( userModel.find()
    ,req.query)
    .select()
    // .pagination()
        const users=await apiFeaturesInstance.mongooseQuery
        if(!users.length){
            return next (new Error('There are no users to show'))
        }
        return res.status(200).json({status:true,message:"Done",users})
    }


export const checkIdentity=async(req,res,next)=>{
    const {identityId}=req.params
    const identity=await identityModel.findById({_id:identityId})
    if(!identity){
        return next(new Error("No such identity"))
    }
    if(!identity.identityImages){
        return next(new Error("No such identity"))
    }
    if(identity.identityVerified){
        return next(new Error("identity already verified"))
    }
    const user=await userModel.findById(identity.userId)
    if(!user){
        return next(new Error("user undefiened"))
    }
    if(user.isVerified){
        return next(new Error("user already verified"))
    }
    if(!req.body.status){
        return next(new Error("Status is required"))
    }
    if(req.body.status=="verified"){
        identity.identityVerified=true
        user.isVerified=true
        await user.save()
        await identity.save()
        await serviceModel.findOneAndUpdate({userId:user._id},{userVerified:true})
        await propertyModel.updateMany({addedBy:user._id},{userVerified:true})

        const html=`<!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sakinny</title>
        </head>
        <body>
          <div style="text-align: center; margin-top: 20px;">
            <h1>Welcome to Sakinny!</h1>
            <p>You are now verified on Sakinny you can upload properties, add services to show it to users </p>
          </div>
        </body>
        </html>`
        await sendEmail({to:user.email,subject:"verification",html})
        return res.json({message:"Done you verify the identity"})
    }
    if(req.body.status=="rejected"){
        const html=`<!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sakinny</title>
        </head>
        <body>
          <div style="text-align: center; margin-top: 20px;">
            <h1>Welcome to Sakinny!</h1>
            <p>Your information are incomplete or have some wrong information please try to update your identity form that contain an image of yourself using your camera and  id front image and back image.</p>
            <h6>Thanks</h6>
          </div>
        </body>
        </html>`
        await sendEmail({to:user.email,subject:"verification",html})
        return res.json({message:"Done you reject the identity"})
    }
}


export const getAllreports=async(req,res,next)=>{
    const apiFeaturesInstance=new ApiFeatures( reportModel.find()
    ,req.query)
    .select()
    .pagination()
        const reports=await apiFeaturesInstance.mongooseQuery
        if(!reports.length){
            return next (new Error('There is no reports uploaded'))
        }
        return res.status(200).json({status:true,message:"Done",reports})
}

export const respondToReport=async(req,res,next)=>{
const {reportId}=req.params
if(!reportId){
    return next (new Error("A report is required"))
}
const report =await reportModel.findById(reportId)
if(!report){
    return next (new Error("Report doesnt exist"))
}
const {response}=req.body
if(!response){
    return next (new Error("You should respond to the report"))
}
report.response=response
await report.save()
const html=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sakinny</title>
</head>
<body>
  <div style="text-align: center; margin-top: 20px;">
    <h1>Welcome to Sakinny!</h1>
    <h6>${response}</h6>
  </div>
</body>
</html>`
await sendEmail({to:report.email,subject:"Report Admin Response",html})

return res.json({status:true,message:"Done"})
}

export const getCounts=async(req,res,next) => {
      const userCount = await userModel.countDocuments({});
      const propertyCount = await propertyModel.countDocuments({});
      const serviceCount = await serviceModel.countDocuments({});
      
      res.json({ users: userCount, properties: propertyCount, services: serviceCount })
}





export const banUser=async(req,res,next)=>{


}

export const getBannedUser=async(req,res,next)=>{


}