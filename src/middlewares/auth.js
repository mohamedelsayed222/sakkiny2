import userModel from '../../DB/models/User.model.js'
import { systemRoles } from '../utils/systemRoles.js'
import { generateToken, verifyToken } from '../utils/tokenFunctions.js'

export const isAuth = (roles) => { 
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers
      if (!authorization) {
        return next(new Error('Please login first', { cause: 400 }))
      }
      // console.log({authorization});

      // if (!authorization.startsWith('')) {
      //   return next(new Error('invalid token prefix', { cause: 400 }))
      // }
      // const splitedToken = authorization.split(' ')[1] || authorization.split('ecomm__')[1]
      try {
        const decodedData = verifyToken({
          token: authorization,
          signature: process.env.TOKEN_SIGNATURE,
        })
        // console.log({decodedData})
        const findUser = await userModel.findById(
          decodedData.id,
          // 'email userName role',
        )
        // console.log({t:decodedData.id,
        //   u:findUser._id
        // });
        if (!findUser) {
          return next(new Error('Please SignUp', { cause: 400 }))
        }
        if(roles){
          if(!roles.includes(findUser.role)){
          return next(new Error('Unauthorized to access this api', { cause: 401 }))
        }
      }
        req.user = findUser
        next()
      } catch (error) {
        // token  => search in db
        if (error == 'TokenExpiredError: jwt expired') {
          // refresh token
          const user = await userModel.findOne({ usertoken: authorization })
          if (!user) {
            return next(new Error('Wrong token', { cause: 400 }))
          }
          // generate new token
          const newToken = generateToken({
            payload: {
              email: user.email,
              _id: user._id,
            },
            signature: process.env.SIGN_IN_TOKEN_SECRET,
            expiresIn: '1h',
          })

          if (!newToken) {
            return next(
              new Error('token generation fail, payload canot be empty', {
                cause: 400,
              }),
            )
          }

          user.usertoken = newToken
          await user.save()
          // await userModel.findOneAndUpdate(
          //   { usertoken: splitedToken },
          //   { usertoken: newToken },
          // )
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
