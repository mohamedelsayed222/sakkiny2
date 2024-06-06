import serviceModel from "../../../DB/models/Service.model.js"
import cloudinary from '../../utils/cloudinaryconfig.js'
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('123456_=!ascbhdtel', 5)

export const addService=async(req,res,next)=>{

    console.log(req.body);
    console.log("*******************************************");
    console.log(req.files)
    const user=req.user
    const {
        description,
        price,
        // country,
        // city,
        address,
        location
    }=req.body
    if(!user.isVerified){
        return next (new Error("Please verify your identity",{cause:200}))
    }

    if (!req.files?.length){
        return next (new Error("Please upload pictures of your service",{cause:200}))
    }

    if(!user.customId){
        const customId = nanoid()
        user.customId=customId
        await user.save()
    }

    const customId = nanoid()
    const images = []
    const publicIds = []
    const serviceFolder=`${process.env.PROJECT_FOLDER}/user/${user.customId}/Service/${customId}`
    
    for (const file of req.files) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
            folder:serviceFolder 
        },
        )
        images.push({ secure_url, public_id })
        publicIds.push(public_id)
    }

    const serviceCategory=req.body.serviceCategory.toLowerCase();
    const service=await serviceModel.create({
        description,
        price,
        serviceCategory,
        images,
        customId,
        // country,
        // city,
        location,
        address,
        userId:user._id
    })

    if(!service){
        await cloudinary.api.delete_resources(publicIds)
        await cloudinary.api.delete_folder(serviceFolder)
        return next(new Error('trye again later', { cause: 400 }))
    }

    res.status(200).json({ status:true, message: 'Done', service })




}

export const updateService=async(req,res,next)=>{

}

export const searchService=async(req,res,next)=>{

}

export const deleteService=async(req,res,next)=>{

}


export const getService=async(req,res,next)=>{

}
