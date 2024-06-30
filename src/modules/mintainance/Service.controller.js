import serviceModel from "../../../DB/models/Service.model.js"
import cloudinary from '../../utils/cloudinaryconfig.js'
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('123456_=!ascbhdtel', 5)
import { ApiFeatures } from "../../utils/apiFeatures.js"


export const addService=async(req,res,next)=>{
    const user=req.user
    const {
        description,
        price,
        latitude,
        longitude,
        address,
    }=req.body

    if (!req.files?.length){
        return next (new Error("Please upload pictures showing your service",{cause:200}))
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
        latitude,
        longitude,
        address,
        userId:user._id
    })

    if(!service){
        await cloudinary.api.delete_resources(publicIds)
        await cloudinary.api.delete_folder(serviceFolder)
        return next(new Error('trye again later', { cause: 400 }))
    }



    
if(!user.isVerified){
    service.userVerified=false
    await service.save()
    res.status(201).json({status:true, message: 'Please verify your identity to show your service',property })
  }

    res.status(201).json({ status:true, message: 'Done, Your service has been uploaded successfully', service })




}

export const getService=async(req,res,next)=>{
    const apiFeaturesInstance=new ApiFeatures( serviceModel.find().populate({path:'userId',
        select:'email name phoneNumber gender status profilePicture -_id'})
    ,req.query)
    .select()
 
    // .pagination()
        const services=await apiFeaturesInstance.mongooseQuery
        return res.status(200).json({status:true,message:"Done",services})
}

export const updateService=async(req,res,next)=>{
    const user=req.user
    const {serviceId}=req.params
    const {
    description,address,location,price,serviceCategory
    }=req.body
    const service=await serviceModel.findById(serviceId)
    if(!service){
        return next(new Error("Service not exist",{cause:200}))
    }
    
    if(!service.userId.equals(user._id)){
        return next(new Error("You are not authorized",{cause:200}))}
    
    
    if(description){service.description=description}
    if(serviceCategory){service.serviceCategory=serviceCategory.toLowerCase()}
    if(address){service.address =address}
    if(longitude||latitude){
        service.longitude =longitude;
        service.latitude =latitude;
      }
    if(price){service.price =price}
    if (req.files.length){
        const serviceImages=[...service.images]
        const serviceFolder=`${process.env.PROJECT_FOLDER}/user/${user.customId}/Service/${service.customId}`
        for (const file of req.files) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
        folder:serviceFolder 
        },
    )
    serviceImages.push({ public_id, secure_url })
    }
    service.images=serviceImages
    }
    if (!service.images?.length){
        return next (new Error("Please upload pictures showing your service",{cause:200}))
    }
    await service.save()
    return res.status(200).json({status:true,message:"Updated",service})
}

export const deleteImage=async (req,res,next)=>{
    const {serviceId}=req.params
    const {public_id}=req.body
    const service=await serviceModel.findById(serviceId)
    if(!service){
        return next(new Error("Service not exist",{cause:200}))
    }
    if(!service.userId.equals(req.user._id)){
        return next(new Error("You are not authorized",{cause:200}))
    }
    const image=service.images.find(i=>i.public_id==public_id)
    if(!image){
        return next(new Error("Wrong Image",{cause:200}))
    }
    service.images.splice(service.images.indexOf(image),1)
    await cloudinary.uploader.destroy(public_id)
    await service.save()
    return res.status(201).json({status:true, message:"Deleted"})
    }

export const searchService=async(req,res,next)=>{
    const apiFeaturesInst=new ApiFeatures( serviceModel.find({})
    .populate({path:'userId',
        select:'email name phoneNumber gender status profilePicture -_id'})
    ,req.query)
    .select()
    .filters()
    .sort()
    // .pagination()
    .search()
        const services=await apiFeaturesInst.mongooseQuery
        if(!services){
            return next(new error("Not found",{cause:404}))
        }
        return res.status(200).json({status:true,message:"Done",services})

}

export const deleteService=async(req,res,next)=>{
    const user=req.user
    const {serviceId}=req.params
    const service=await serviceModel.findById(serviceId)
    if(!service){
      return next(new Error("Service not exist",{cause:200}))
    }
    if(!service.userId==req.user._id){
      return next(new Error("You are not authorized",{cause:200}))
    }
    const publicIds=[]
    const serviceFolder=`${process.env.PROJECT_FOLDER}/user/${user.customId}/Service/${service.customId}`
    for (const image of service.images) {
        publicIds.push(image.public_id)
    }
    await serviceModel.deleteOne({_id:serviceId})
    await cloudinary.api.delete_resources(publicIds)
    await cloudinary.api.delete_folder(serviceFolder)
    return res.status(201).json({status:true,message:"Deleted"})
}

export const getSpecificService=async(req,res,next)=>{
    const {serviceId}=req.params
    const {select}=req.query
    const apiFeaturesInstance=new ApiFeatures( serviceModel.findById({_id:serviceId})
    .populate({path:'userId',
        select:'email name phoneNumber gender status profilePicture -_id'})
    ,req.query)
    .select()
        const service=await apiFeaturesInstance.mongooseQuery
        return res.status(200).json({status:true,message:"Done",service})
}




export const likeService=async(req,res,next)=>{
    const user=req.user 
    const {serviceId}=req.params
    if(!serviceId){
        return next(new Error("Error 404"))
    }
    const service =await serviceModel.findById(serviceId)
    if (!service){
        return next(new Error("Service not found"))
    }
    const serviceExist=user.likedServices.find(ele=>ele.equals(serviceId))
    if(serviceExist){
        service.likesCount-=1
        user.likedServices = user.likedServices.filter(prop => !prop.equals(serviceId));
        await service.save()
        await user.save()
        return res.json({status:true,message:"Removed"})
    }
    service.likesCount+=1
    user.likedServices.push(serviceId)
    await service.save()
    await user.save()
    return res.json({status:true,message:"Added to Favorite"})
}

export const getLikedServices=async(req,res,next)=>{
    const user=req.user
    const likedServicesIds = user.likedServices.map(post => post._id);
    const apiFeaturesInstance=new ApiFeatures( serviceModel.find(
        { _id: { $in:  likedServicesIds } }
    )
    .populate({path:'userId',
        select:'email name phoneNumber gender status profilePicture -_id'})
,req.query)
.select()
// .pagination()
    const services=await apiFeaturesInstance.mongooseQuery
    if(!services.length){
        return next (new Error("There is no liked services")) 
    }
    return res.status(200).json({status:true,message:"Done",services})
}

