import joi from 'joi'

const locationSchema=joi.object({
    long:joi.number().required(),
    lat:joi.number().required()})
const essentialsSchema=joi.object({
    balcony:joi.boolean(),
    kitchen:joi.boolean(),
    landLine:joi.boolean(),
    privateGarden:joi.boolean(),
    elevator:joi.boolean(),
    naturalGas:joi.boolean(),
    wifi:joi.boolean()
})
export const addProperty={
body:
        joi.object({
            description :joi.string().min(10).max(500).required(),
            type:joi.string().required(),
            area:joi.number().positive().required(),
            level:joi.string().required(),
            roomsNumber:joi.number().positive(),
            bathrooms:joi.number().positive().required(),
            badrooms:joi.number().positive().required(),
            isFurnished:joi.boolean(),
            price:joi.number().positive().required(),
            per:joi.string(),
            numberOfGuests:joi.string(),
            address:joi.string().required(),
            location:locationSchema.required(),
            essentials:essentialsSchema.required()
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
                numberOfGuests:j,
                address:joi.string(),
                location:locationSchema,
                essentials:essentialsSchema
    }).required().options({allowUnknown:false})
    }