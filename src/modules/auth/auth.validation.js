import joi from 'joi'
export const signup={
body:
        joi.object({
                firstName:joi.string().min(2).max(20).required(),
                lastName :joi.string().min(2).max(20).required(),
                address:joi.array().min(1).max(4).required(),
                age:joi.number().min(15).required(),
                phoneNumber:joi.string().required(),
                gender:joi.string().required(),
                email:joi.string()
                .email({minDomainSegments:2,maxDomainSegments:4,
                        tlds:{allow:['com','net','edu','org']}})
                        .min(8).lowercase().required(),
                password:joi.string()
                        .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/))
                        .required(),
                cpassword: joi.string().valid(joi.ref('password')).required(),            
}).required().options({allowUnknown:false})
}

export const login={
body:
        joi.object({
        email:
        joi.string()
        .email({minDomainSegments:2,maxDomainSegments:4,
                tlds:{allow:['com','net','edu','org'],
                        deny:['mo','hi']}
                })
        .min(8)
        .lowercase()
        .required(),
        password:joi.string()
                .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/))
                .required(),
}).required().options({allowUnknown:false})
}