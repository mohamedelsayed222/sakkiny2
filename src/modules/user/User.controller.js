import userModel from "../../../DB/models/User.model.js";
import cloudinary from "../../utils/cloudinaryconfig.js";
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('123456_=!ascbhdtel', 5)
export const hellouser=(req,res)=>{
    res.send("Hello User")
}






export const uploadProfilePic=async(req,res,next)=>{
    const user=req.user
    if(!req.file){
        return next (new Error("upload a picture",{cause:400}))
    }
    if(user.profilePicture?.public_id){
        await cloudinary.uploader.destroy(user.profilePicture.public_id) 
    
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



export const getUser=async(req,res,next)=>{
    const user=req.user
    return res.status(200).json({status:true,message:"Done",user})
    }

    export const getProperties=async(req,res,next)=>{
        const user=req.user
        const apiFeaturesInstance=new ApiFeatures( propertyModel.find({addedBy:user._id})
        ,req.query)
        .select()
        // .pagination()
            const properties=await apiFeaturesInstance.mongooseQuery
            if(!properties.length){
                return next (new Error('There are no uploaded properties'))
            }
            return res.status(200).json({status:true,message:"Done",properties})
        }
    
    export const getService=async(req,res,next)=>{
        const user=req.user
        const apiFeaturesInstance=new ApiFeatures( serviceModel.find({userId:user._id})
        ,req.query)
        .select()
        // .pagination()
            const service=await apiFeaturesInstance.mongooseQuery
            if(!service.length){
                return next (new Error('No Service'))
            }
            return res.status(200).json({status:true,message:"Done",service})
        }