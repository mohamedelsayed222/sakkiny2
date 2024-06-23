import joi from 'joi'

const locationSchema=joi.object({
    longitude:joi.number(),
    latitude:joi.number()})
// const essentialsSchema=joi.object({
//     balcony:joi.boolean(),
//     kitchen:joi.boolean(),
//     landLine:joi.boolean(),
//     privateGarden:joi.boolean(),
//     elevator:joi.boolean(),
//     naturalGas:joi.boolean(),
//     wifi:joi.boolean()
// })
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
            // location:locationSchema.required(),
            // essentials:essentialsSchema.required()
            details:joi.string(),
}).required().options({allowUnknown:false})
}

export const updateProperty={
    body:
            joi.object({
                description :joi.string().min(10).max(500),
                type:joi.string(),
                area:joi.number().positive(),
                level:joi.string(),
                roomsNumber:joi.number().positive(),
                bathrooms:joi.number().positive(),
                badrooms:joi.number().positive(),
                isFurnished:joi.boolean(),
                price:joi.number().positive(),
                per:joi.string(),
                numberOfGuests:joi.string(),
                address:joi.string(),
                location:locationSchema,
                details:joi.string(),
                // essentials:essentialsSchema
    }).required().options({allowUnknown:false})
    }