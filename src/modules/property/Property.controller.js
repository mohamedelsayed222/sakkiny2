import { ApiFeatures } from "../../utils/apiFeatures.js"
import propertyModel from '../../../DB/models/Property.model.js'



export const getAllProperties=async(req,res,next)=>{
const apiFeaturesInstance=new ApiFeatures( propertyModel.find()
    .populate({path:'addedBy',
        select:'email name phoneNumber gender status profilePicture -_id'})
,req.query)
.select()
// .pagination()
    const properties=await apiFeaturesInstance.mongooseQuery
    return res.status(200).json({status:true,message:"Done",properties})
}

export const getSpecificProperty=async(req,res,next)=>{
    const {propertyId}=req.params
    const {select}=req.query
    const apiFeaturesInstance=new ApiFeatures( propertyModel.findById({_id:propertyId})
    .populate({path:'addedBy',
        select:'email name phoneNumber gender status profilePicture -_id'})
    ,req.query)
    .select()
        const property=await apiFeaturesInstance.mongooseQuery
        return res.status(200).json({status:true, message:"Done",property})
}

export const searchProperty=async(req,res,next)=>{
    const apiFeaturesInst=new ApiFeatures( propertyModel.find({}).populate({path:'addedBy',
        select:'email name phoneNumber gender status profilePicture -_id'})
        ,req.query)
    .select()
    .filters()
    .sort()
    // .pagination()
    .search()
        const properties=await apiFeaturesInst.mongooseQuery
        if(!properties){
            return next(new error("Not found",{cause:404}))
        }
        return res.status(200).json({status:true, message:"Done",properties})

}


export const likeproperty=async(req,res,next)=>{
    const user=req.user 
    const {propertyId}=req.params
    if(!propertyId){
        return next(new Error("Error 404"))
    }
    const property =await propertyModel.findById(propertyId)
    if (!property){
        return next(new Error("Property not found"))
    }
    property.likesCount+=1
    user.likedProperties.push(propertyId)
    await property.save()
    await user.save()
    return res.json({status:true,message:"Added to Likes"})
}

export const getlikedProperties=async(req,res,next)=>{
    const user=req.user
    const likedPropertiesIds = user.likedProperties.map(post => post._id);
    const apiFeaturesInstance=new ApiFeatures( propertyModel.find(
        { _id: { $in: likedPropertiesIds } }
    )
    .populate({path:'addedBy',
        select:'email name phoneNumber gender status profilePicture -_id'})
,req.query)
.select()
// .pagination()
    const properties=await apiFeaturesInstance.mongooseQuery
    if(!properties.length){
        return next (new Error("There is no liked properties")) 
    }
    return res.status(200).json({status:true,message:"Done",properties})
}


// export const recommendProperty=async(req,res,next)=>{
//     const user=req.user

//     let query
//     if(property.address.street=user.address.street){

//     } 
//     const properties=await propertyModel.find({
//     $or:[
//         {
//             location: {
//             $near: {
//                 $geometry: { type: "Point", coordinates: [user.location.longtitude, user.location.latitude] },
//                 $maxDistance: 1000,
//             },
//             },
//           },
//           {"property.address.street":user.address.street},
//           {"property.address.village":user.address.village},
//           {"property.address.city":user.address.city},
//           {"property.address.country":user.address.country},
//     ]
//     })
// return res.status(200).json({message:"Done",properties})
// }




