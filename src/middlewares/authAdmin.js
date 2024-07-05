import adminModel from '../../DB/models/Admin.model.js'
import { generateToken, verifyToken } from '../utils/tokenFunctions.js'

export const isAuthAdmin = () => { 
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers
      if (!authorization) {
        return next(new Error('login first', { cause: 400 }))
      }
    
      try {
        const decodedData = verifyToken({
          token: authorization,
          signature: process.env.TOKEN_SIGNATURE,
        })
        const findAdmin = await adminModel.findById(
          decodedData.id,
          // 'email userName role',
        )
        if (!findAdmin) {
          return next(new Error('Please SignUp', { cause: 400 }))
        }
        req.admin = findAdmin
        next()
      } catch (error) {
        // token  => search in db
        if (error == 'TokenExpiredError: jwt expired') {
          // refresh token
          const admin = await adminModel.findOne({ adminToken: authorization })
          if (!admin) {
            return next(new Error('Wrong token', { cause: 400 }))
          }
          // generate new token
          const newToken = generateToken({
            payload: {
              email: user.email,
              _id: user._id,
            },
            signature: process.env.SIGN_IN_TOKEN_SECRET,
            expiresIn: '1d',
          })

        if (!newToken) {
            return next(
              new Error('token generation fail, payload canot be empty', {
                cause: 400,
              }),
            )
          }

          admin.adminToken = newToken
          await admin.save()

          return res.status(200).json({ message: 'Token refreshed', newToken })
        }
        return next(new Error('invalid token', { cause: 500 }))
      }
    } catch (error) {
      console.log(error)
      next(new Error('catch error in auth', { cause: 500 }))
    }
  }
}
