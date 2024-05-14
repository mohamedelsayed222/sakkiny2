import joi from 'joi'
export const signup={
body:
        joi.object({
                name :joi.string().min(5).max(30).required(),
                // address:joi.array().min(1).max(4).required(),
                age:joi.number().min(15),
                phoneNumber:joi.string().min(11).max(11).required(),
                gender:joi.string(),
                email:joi.string()
                .email({minDomainSegments:2,maxDomainSegments:4,
                        tlds:{allow:['com']}})
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
                tlds:{allow:['com']}
                })
        .min(8)
        .lowercase()
        .required(),
        password:joi.string()
                .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/))
                .required(),
}).required().options({allowUnknown:false})
}