import bcrypt from 'bcryptjs'
import userModel from '../../../DB/models/User.model.js';
import { asyncHandler } from '../../utils/errorHandling.js';
import  sendEmail  from '../../services/sendEmailService.js';
import { generateToken, verifyToken } from '../../utils/tokenFunctions.js';


export const signup=asyncHandler(
async(req,res,next)=>{
    const {
        name,
        email,
        password,
        phoneNumber,
        age,
        gender,

    }=req.body
    // console.log(address);
    //check
    const checkEmail=await userModel.findOne({email})
    if(checkEmail){
    return next(new Error("Email exist" ,{cause:200}))
    }

    const hashpassword=bcrypt.hashSync
    (password,parseInt(process.env.SALT_ROUND)) 
  
    const token=generateToken({
        payload:{email:email},
        signature:process.env.EMAIL_SIGNATURE,
        // expiresIn:60*60
    })
    // console.log(token);
    // const retoken=generateToken({
    //     payload:{email:email},
    //     signature:process.env.EMAIL_SIGNATURE,
    //     expiresIn:60*60*24*30
    // })
    // console.log(retoken);
    //send Email to confirm user email
        const link =`${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`
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
    //save user to DB
  
    const user=await userModel.create({
        name,
        email,
        password:hashpassword,
        // address,
        age,
        gender,
        phoneNumber,
    })
    if(!user){
        return next (new Error('try again later',{cause:500}))
    }
    return res.status(201).json({status:true,message:"You have been signed in successfully, please activiate your gmail account",user})
}
)

export const confirmEmail=asyncHandler(
  async(req,res,next)=>{
    const {token}=req.params
    const decoded=verifyToken({token,signature:process.env.EMAIL_SIGNATURE})
    // console.log(decoded);
    const user =await userModel.findOneAndUpdate(
        {email:decoded.email},
        {confirmEmail:true},
        {new:true})
        // console.log(user);
    return user ? res.send("Your Email Confirmed")
    : res.send(`<a href="${req.protocol}://${req.headers.host}/auth/signup">
    ooops you look like you don't sign up follow me to sign up
    </a>`
    )}
)

// export const resendConfirmEmail=asyncHandler(
//     async(req,res,next)=>{
//     const {token}=req.params
//     const decoded=verifyToken({token,signature:process.env.EMAIL_SIGNATURE})
//     const user=await userModel.findOne(decoded.email)
//     if (!user||!user._id){
//     res.send(`<a href="${req.protocol}://${req.headers.host}/auth/signup">
//         ooops you look like you don't sign up follow me to sign up
//     </a>`
//         )
//     }
//     if (user.confirmEmail==true){
//     res.send(`<a href="${req.protocol}://${req.headers.host}/auth/login">
//     you look like you have already confirmed your Email go to login page
//         </a>`
//     )
// }

//     const newtoken=generateToken({
//         payload:{id:user._id,email:user.email},
//         signature:process.env.EMAIL_SIGNATURE,
//         expiresIn:60*2
//     })
//     const link=`${req.protocol}://${req.headers.host}/auth/confirmEmail/${newtoken}`
//     const html=`<!DOCTYPE html>
//         <html lang="en">
//         <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Sakinny</title>
//         </head>
//         <body>
//           <div style="text-align: center; margin-top: 20px;">
//             <h1>Welcome to Sakinny!</h1>
//             <p>Please confirm your email address.</p>
//             <button style="background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">
//             <a href="${link}" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff ; text-decoration: none; text-decoration: none; padding: 15px 25px; border-radius: 2px; display: inline-block;">Activate Account</a> 
//             </button>
//             <br>
//           </div>
//         </body>
//         </html>`
//     await sendEmail({to:user.email,subject:"confirmation",html})
//     return res.send("Check your inbox")
//   }
// )

export const login=asyncHandler(
    async(req,res,next)=>{
    const {email,password}=req.body
    const user=await userModel.findOne({email})
    if(!user){
    return next(new Error("Invalid Email email does not exist ",{cause:200}))
        }
    const match=bcrypt.compareSync(password,user.password)
    if(!match){
    return next(new Error("Invalid login data",{cause:200}))
    }

    if(user.confirmEmail==false){
    return next(new Error("Please Confirm Your Email",{cause:200}))
    }
    const token=generateToken({
        payload:{
            email:user.email,
            userName:user.userName,
            id:user._id,
            role:user.role,
            islogged:true
        },
        signature:process.env.TOKEN_SIGNATURE,
        // expiresIn:60*60*24

    })
    if(!token){
        return next(new Error("Payload is required ya fanan",{cause:200}))
    }
    user.usertoken=token 
    user.status="Online"
    await user.save()
    return res.status(200).json({status:true,message:"You have been logged in successfully",data:user})
    }
)

export const forgetPassword=asyncHandler(
    async(req,res,next)=>{
        const {email}=req.body
        const user=await userModel.findOne({email})
        if(!user){
            return next(new Error("Email does not exist ",{cause:200}))
        }
        const token=generateToken({
                payload:{id:user._id,email:user.email},
                signature:process.env.EMAIL_SIGNATURE,
                expiresIn:60*5
            })
        const link =
        `${req.protocol}://${req.headers.host}/auth/resetPassword/${token}`

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
            <a href="${link}" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff ; text-decoration: none; text-decoration: none; padding: 15px 25px; border-radius: 2px; display: inline-block;">Update Password</a> 
            </button>
            <br>
          </div>
        </body>
        </html>`
        await sendEmail({to:user.email,subject:"confirmation",html})
        return res.status(200).json({status:true,message:"Check your Email"})
    }
)

export const resetPassword=asyncHandler(
    async(req,res,next)=>{
    const {token}=req.params
    const {password ,cpassword}=req.body
    if(!token || !password){
            return next(new Error('Fields are required'))
        }
    if (password!=cpassword){
        return next(new Error('Not matched'))
    }
    const decoded=verifyToken({token,signature:process.env.EMAIL_SIGNATURE})
    if(!decoded){
        return next(new Error('Invalid Token'))
    }
    const hashpassword=bcrypt.hashSync(password,parseInt(process.env.SALT_ROUND))
    const user =await userModel.findOneAndUpdate({email:decoded.email},{password:hashpassword})
    return user ? res.json({status:true,message:"Done"})
        : res.send(`
        ooops you look like you don't sign up`
    )}
)

export const updatePassword=asyncHandler(
    async(req,res,next)=>{
        const {oldPassword,newPassword,cnewPassword}=req.body
        const user=req.user
        const match=bcrypt.compareSync(oldPassword,user.password)
        if(!match){
        return next(new Error("Wrong password",{cause:200}))
        }
        if (newPassword!=cnewPassword){
            return next(new Error('Not matched'))
        }
        const hashpassword=bcrypt.hashSync(newPassword,parseInt(process.env.SALT_ROUND))
        user.password=hashpassword
        user.save()
        return res.json({status:true,message:"Done your password updated"})
    })


