import { ApiFeatures } from "../../utils/apiFeatures.js"
import propertyModel from '../../../DB/models/Property.model.js'



export const getAllProperties=async(req,res,next)=>{
const {select}=req.query
const apiFeaturesInstance=new ApiFeatures( propertyModel.find()
,req.query)
.select()
// .pagination()
    const properties=await apiFeaturesInstance.mongooseQuery
    return res.status(200).json({message:"Done",properties})
}

export const getSpecificProperty=async(req,res,next)=>{
    const {propertyId}=req.params
    const {select}=req.query
    const apiFeaturesInstance=new ApiFeatures( propertyModel.findById({_id:propertyId}),req.query)
    .select()
        const property=await apiFeaturesInstance.mongooseQuery
        return res.status(200).json({message:"Done",property})
}

// export const filterProperty=async(req,res,next)=>{
//     const apiFeaturesInst=new ApiFeatures( propertyModel.find({}),req.query)
//     .select()
//     .filters()
//     .sort()
//     // .pagination()
//         const properties=await apiFeaturesInst.mongooseQuery
//         if(!properties){
//             return next(new error("Not found",{cause:404}))
//         }
//         return res.status(200).json({message:"Done",properties})

// }

export const searchProperty=async(req,res,next)=>{
    const apiFeaturesInst=new ApiFeatures( propertyModel.find({}),req.query)
    .select()
    .filters()
    .sort()
    .pagination()
    .search()
        const properties=await apiFeaturesInst.mongooseQuery
        if(!properties){
            return next(new error("Not found",{cause:404}))
        }
        return res.status(200).json({message:"Done",properties})

}

export const recommendProperty=async(req,res,next)=>{
    const user=req.user

    let query
    if(property.address.street=user.address.street){

    } 
    const properties=await propertyModel.find({
    $or:[
        {
            location: {
            $near: {
                $geometry: { type: "Point", coordinates: [user.location.longtitude, user.location.latitude] },
                $maxDistance: 1000,
            },
            },
          },
          {"property.address.street":user.address.street},
          {"property.address.village":user.address.village},
          {"property.address.city":user.address.city},
          {"property.address.country":user.address.country},
    ]
    })
return res.status(200).json({message:"Done",properties})
}




