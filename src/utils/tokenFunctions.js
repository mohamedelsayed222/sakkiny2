import jwt from 'jsonwebtoken'

//==========generate token===================
export const generateToken=({
    payload={},
    signature=process.env.DEFAULT_SIGNATURE,
    // expiresIn
}={})=>{
    if(!Object.keys(payload).length){
        return false
    }
    const token=jwt.sign(payload,signature
        // ,{expiresIn}
    )
    return token 
}

//=========verify token=======================
export const verifyToken=({
    token='',
    signature=process.env.DEFAULT_SIGNATURE
}={})=>{
    if(!token){
        return false
    }
    const data=jwt.verify(token,signature,)
    return data 
}