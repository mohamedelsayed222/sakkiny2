import {Router} from 'express'
// import * as identityController from './identity.controller.js'
import { isAuth } from '../../middlewares/auth.js'
import { asyncHandler } from '../../utils/errorHandling.js'
const router= Router()

// router.get("/",(req,res,next)=>{
//     res.send('Hello Identity')
// })
// router.post('/verifyphone',isAuth(),asyncHandler(identityController.sendVerificationNumber))
    

export default router
