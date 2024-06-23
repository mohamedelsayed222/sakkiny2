import joi from "joi"


export const addService={
    body:
            joi.object({
                description :joi.string().min(10).max(500).required(),
                price:joi.number().positive().required(),
                // country:joi.string().required(),
                // city:joi.string().required(),
                address:joi.string().required(),
                serviceCategory:joi.string().required(),
                longitude:joi.number(),
                latitude:joi.number(),
    }).required()
    }


    export const updateService={
        body:
                joi.object({
                    description :joi.string().min(10).max(500),
                    price:joi.number().positive(),
                    address:joi.string(),
                    serviceCategory:joi.string(),
                    longitude:joi.number(),
                    latitude:joi.number()
                        }).required()
        }