import joi from "joi"


const locationSchema=joi.object({
    long:joi.number(),
    lat:joi.number()})

export const addService={
    body:
            joi.object({
                description :joi.string().min(10).max(500).required(),
                price:joi.number().positive().required(),
                country:joi.string().required(),
                city:joi.string().required(),
                serviceCategory:joi.string().required(),
                location:locationSchema
    }).required().options({allowUnknown:false})
    }