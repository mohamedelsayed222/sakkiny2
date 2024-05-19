
// import userModel from '../../../DB/models/User.model.js'
import { customAlphabet } from 'nanoid'
import propertyModel from '../../../DB/models/Property.model.js'
import cloudinary from '../../utils/cloudinaryconfig.js'
const nanoid = customAlphabet('123456_=!ascbhdtel', 5)
export const addProperty=async(req,res,next)=>{
const {description,
    type,
    area,level,
    roomsNumber,
    bedrooms,
    bathroms,
    isFurnished,
    SurroundingFacilities,
    price,per,
    numberOfGuests,
    address,
    location,
    details}=req.body
    const user=req.user
if(!user.isVerified){
    return next (new Error("Please verify your identity",{cause:200}))
}
if (!req.files?.length||req.files.length<5){
    return next (new Error("Please upload  at least 5 pictures of your property",{cause:200}))
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

const property=await propertyModel.create(
  {
    description,
    type,
    area,level,
    roomsNumber,
    bedrooms,
    bathroms,
    isFurnished,
    SurroundingFacilities,
    price,per,
    numberOfGuests,
    address,
    location,
    details,
    addedBy:user._id,
    customId
    
})
if (!property) {
  await cloudinary.api.delete_resources(publicIds)
  await cloudinary.api.delete_folder(propertyFolder)
  return next(new Error('trye again later', { cause: 400 }))
}
res.status(200).json({ message: 'Done', property })
}



export const updateProperty=async (req,res,next)=>{
const user=req.user
const {propertyid}=req.params
const {description,
  title,
  type,
  size,level,
  roomsNumber,
  isFurnished,
  SurroundingFacility,
  price,per,
  // address,
  // location,
  numberOfGuests,
  details,
}=req.body
  const property=await propertyModel.findById(propertyid)
  if(!property){
    return next(new Error("Property not exist",{cause:200}))
  }
  // console.log(!property.addedBy==user._id);
  // console.log(property.addedBy==user._id);
  // console.log(property.addedBy===user._id);
  // console.log(property.addedBy.equals(user._id)); // Assuming `equals` is a method for object comparison


  // console.log({u:user._id,
  //   pu:property.addedBy
  // });
  if(!property.addedBy==user._id){
    return next(new Error("You are not authorized",{cause:200}))
  }
  if(SurroundingFacility){
  if(!property.SurroundingFacilities.includes(SurroundingFacility))
    property.SurroundingFacilities.push(SurroundingFacility)
  }
  if(description){property.description=description}
  if(title){property.title=title}
  if(type){property.type=type}
  if(numberOfGuests){property.numberOfGuests =numberOfGuests}
  if(price){property.price =price}
  if(per){property.per =per}
  if(isFurnished){property.isFurnished =isFurnished}
  if(roomsNumber){property.roomsNumber =roomsNumber}
  if(level){property.level =level}
  if(size){property.size =size}
  if(details){
    property.details.balacony=details.balacony||property.details.balacony
    property.details.elevator=details.elevator||property.details.elevator
    property.details.landLine=details.landLine||property.details.landLine
    property.details.privateGarden=details.privateGarden||property.details.privateGarden
    property.details.naturalGas=details.naturalGas|| property.details.naturalGas
    property.details.wifi=details.wifi|| property.details.wifi
  }
  if (req.files.length){
    const propertyImages=[...property.propertyImages]
    // console.log(propertyImages);
    const propertyFolder=`${process.env.PROJECT_FOLDER}/user/${user.customId}/Property/${property.customId}`
    for (const file of req.files) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
    file.path,
    {
      folder:propertyFolder 
    },
  )
  propertyImages.push({ public_id, secure_url })
  // console.log(propertyImages);

}
property.propertyImages=propertyImages
}
await property.save()
return res.status(200).json({message:"Updated",property})
}


export const deletePropertyImage=async (req,res,next)=>{
  const {propertyid}=req.params
  const {public_id}=req.body
  const property=await propertyModel.findById(propertyid)
  if(!property){
    return next(new Error("Property not exist",{cause:200}))
  }
  if(!property.addedBy==req.user._id){
    return next(new Error("You are not authorized",{cause:200}))
  }
  // if(!property.propertyImages.includes({secure_url,public_id,_id})){
    
  //   return next(new Error("Wrong Image",{cause:400}))
  // }

  const image=property.propertyImages.find(i=>i.public_id=public_id)
  if(!image){
      return next(new Error("Wrong Image",{cause:200}))
  }
  console.log(image);
  property.propertyImages.splice(property.propertyImages.indexOf(image),1)
  await cloudinary.uploader.destroy(public_id)
  await property.save()
return res.status(201).json({message:"Deleted"})
}



export const deleteProperty=async (req,res,next)=>{
  const {propertyid}=req.params
  const property=await propertyModel.findByIdAndDelete(propertyid)
  // console.log(property);
  if(!property){
    return next(new Error("Property not exist",{cause:200}))
  }
  if(!property.addedBy==req.user._id){
    return next(new Error("You are not authorized",{cause:200}))
  }
  // console.log(property.customId);
const publicIds=[]
const propertyFolder=`${process.env.PROJECT_FOLDER}/user/${req.user.customId}/Property/${property.customId}`
  for (const image of property.propertyImages) {
    // await cloudinary.uploader.destroy(image.public_id);
  publicIds.push(image.public_id)
  }
  // await cloudinary.api.delete_all_resources(propertyFolder)
  await cloudinary.api.delete_resources(publicIds)
  await cloudinary.api.delete_folder(propertyFolder)
  return res.status(201).json({message:"Deleted"})
}




export const hideProperty=(req,res,next)=>{


}


