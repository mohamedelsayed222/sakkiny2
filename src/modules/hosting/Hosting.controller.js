
import propertyModel from '../../../DB/models/Property.model.js'
import cloudinary from '../../utils/cloudinaryconfig.js'
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('123456_=!ascbhdtel', 5)

export const addProperty=async(req,res,next)=>{

const {
    description,area,level,roomsNumber,
    bedrooms,bathrooms,isFurnished,
    price,numberOfGuests,address,
    latitude,
    longitude,
    // location,
    details
    // SurroundingFacilities,
    }=req.body
    const user=req.user
///////////////////validation/////////////////////////
if (!req.files?.length||req.files.length<5){
    return next (new Error("Please upload  at least 5 pictures of your property",{cause:200}))
}
///////////////////////////////////////////
const essentials={}
if(details){
  const detailsarr =details.split(',')
  for(const ele of detailsarr){
    essentials[ele]=true
    }
  }  
if(!user.customId){
  const customId = nanoid()
  user.customId=customId
  await user.save()
  }

const customId = nanoid()
const propertyImages = []
const publicIds = []
const propertyFolder=`${process.env.PROJECT_FOLDER}/user/${user.customId}/Property/${customId}`

for (const file of req.files) {
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    file.path,
    {
      folder:propertyFolder 
    },
  )
  propertyImages.push({ secure_url, public_id })
  publicIds.push(public_id)
}
const type=req.body.type.toLowerCase();
const per=req.body.per?.toLowerCase();
const addedByType=req.body.addedByType?.toLowerCase()
const property=await propertyModel.create(
  {
    description,
    type,
    area,level,
    roomsNumber,
    bedrooms,
    bathrooms,
    isFurnished,
    price,per,
    numberOfGuests,
    address,
    // location,
    latitude,
    longitude,
    essentials,
    addedBy:user._id,
    addedByType,
    propertyImages,
    customId
    // SurroundingFacilities,
})

if (!property) {
  await cloudinary.api.delete_resources(publicIds)
  await cloudinary.api.delete_folder(propertyFolder)
  return next(new Error('try again later', { cause: 404 }))
}

if(!user.isVerified){
  property.userVerified=false
  await property.save()
  res.status(201).json({status:true, message: 'Please verify your identity to show your property',property })
}
res.status(201).json({status:true, message: 'Uploaded',property })
}

export const updateProperty=async (req,res,next)=>{
const user=req.user
const {propertyId}=req.params
const {
  description,
  type,
  area,level,
  roomsNumber,
  bedrooms,
  bathrooms,
  isFurnished,
  price,per,
  numberOfGuests,
  latitude,
  longitude,
  address,
  // location,
  // public_ids,
  propertyStatus,
  details,
  addedByType
}=req.body
console.log(propertyId);
  const property=await propertyModel.findById(propertyId)
  if(!property){
    return next(new Error("Property not exist",{cause:200}))
  }
  if(!property.addedBy.equals(user._id)){
    return next(new Error("You are not authorized",{cause:200}))}
  if(description){property.description=description}
  if(type){property.type=type.toLowerCase()}
  if(numberOfGuests){property.numberOfGuests =numberOfGuests}
  if(bedrooms){property.bedrooms =bedrooms}
  if(bathrooms){property.bathrooms =bathrooms}
  if(address){property.address =address}
  // if(location){property.location =location}
  if(longitude||latitude){
    property.longitude =longitude;
    property.latitude =latitude;
  }
  if(propertyStatus){
    property.propertyStatus=propertyStatus 
  }
  if(price){property.price =price}
  if(per){property.per =per.toLowerCase()}
  if(addedByType){property.addedByType=addedByType.toLowerCase()}
  if(isFurnished){property.isFurnished =isFurnished}
  if(roomsNumber){property.roomsNumber =roomsNumber}
  if(level){property.level =level}
  if(area){property.area =area}
  if(details){
    for (let key in property.essentials){
      if (property.essentials[key] == true) {
        property.essentials[key] = false;
    } 
    }
    const detailsarr =details.split(',')
    for(const ele of detailsarr){
      property.essentials[ele]=true
    }
    }
  if (req.files.length){
    const propertyImages=[...property.propertyImages]
    const propertyFolder=`${process.env.PROJECT_FOLDER}/user/${user.customId}/Property/${property.customId}`
    for (const file of req.files) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
    file.path,
    {
      folder:propertyFolder 
    },
  )
  propertyImages.push({ public_id, secure_url })
}
property.propertyImages=propertyImages


}
if(property.propertyImages.length<5){
  return next(new Error("The Images should be at least 5",{cause:200}))
}
await property.save()
return res.status(200).json({message:"Updated",property})
}

export const deletePropertyImage=async (req,res,next)=>{
  const {propertyId}=req.params
  const {public_id}=req.body
  const property=await propertyModel.findById(propertyId)
  if(!property){
    return next(new Error("Property not exist",{cause:200}))
  }
  if(!property.addedBy.equals(req.user._id)){
    return next(new Error("You are not authorized",{cause:200}))
  }
  const image=property.propertyImages.find(i=>i.public_id==public_id)
  if(!image){
      return next(new Error("Wrong Image",{cause:200}))
  }

  property.propertyImages.splice(property.propertyImages.indexOf(image),1)
  await cloudinary.uploader.destroy(public_id)
  await property.save()
return res.status(200).json({message:"Deleted"})
}

export const deleteProperty=async (req,res,next)=>{
  const {propertyId}=req.params
  const property=await propertyModel.findById(propertyId)
  if(!property){
    return next(new Error("Property not exist",{cause:200}))
  }
  if(!property.addedBy==req.user._id){
    return next(new Error("You are not authorized",{cause:200}))
  }
const publicIds=[]
const propertyFolder=`${process.env.PROJECT_FOLDER}/user/${req.user.customId}/Property/${property.customId}`
  for (const image of property.propertyImages) {
    // await cloudinary.uploader.destroy(image.public_id);
  publicIds.push(image.public_id)
  }
  // await cloudinary.api.delete_all_resources(propertyFolder)
  await propertyModel.deleteOne({_id:propertyId})
  await cloudinary.api.delete_resources(publicIds)
  await cloudinary.api.delete_folder(propertyFolder)
  return res.status(201).json({status:true,message:"Deleted"})
}

export const hideProperty=async(req,res,next)=>{

}
