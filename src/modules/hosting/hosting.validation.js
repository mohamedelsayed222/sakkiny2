import joi from 'joi'
import { generalFields } from '../../middlewares/validation.js'
export const addProperty={
body:
        joi.object({
            description :joi.string().min(10).max(500).required(),
            type:joi.string().required(),
            area:joi.number().positive().required(),
            level:joi.string().required(),
            roomsNumber:joi.number().positive(),
            bathrooms:joi.number().positive().required(),
            bedrooms:joi.number().positive().required(),
            isFurnished:joi.boolean(),
            price:joi.number().positive().required(),
            per:joi.string(),
            addedByType:joi.string(),
            numberOfGuests:joi.string(),
            address:joi.string().required(),
            longitude:joi.number().required(),
            latitude:joi.number().required(),
            details:joi.string(),
}).required()
// .options({allowUnknown:false})
}

export const updateProperty={
    body:
            joi.object({
                description :joi.string().min(10).max(500),
                type:joi.string(),
                area:joi.number().positive(),
                level:joi.string(),
                propertyStatus:joi.string(),
                roomsNumber:joi.number().positive(),
                bathrooms:joi.number().positive(),
                bedrooms:joi.number().positive(),
                isFurnished:joi.boolean(),
                price:joi.number().positive(),
                per:joi.string(),
                numberOfGuests:joi.string(),
                address:joi.string(),
                details:joi.string(),
                longitude:joi.number(),
                latitude:joi.number()
                // essentials:essentialsSchema
    }).required(),
    // .options({allowUnknown:false})
    params:joi.object({
        propertyId:generalFields._id.required(),
    })
    }