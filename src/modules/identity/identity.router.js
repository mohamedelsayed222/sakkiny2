import {Router} from 'express'
import * as identityController from './Identity.controller.js'
import { isAuth } from '../../middlewares/auth.js'
import { asyncHandler } from '../../utils/errorHandling.js'
const router= Router()

router.get("/",(req,res,next)=>{
    res.send('Hello Identity')
})
router.post('/sendcode',isAuth(),asyncHandler(identityController.sendVerificationNumber))
router.put('/verifyphone',isAuth(),asyncHandler(identityController.verifyNumber))


export default router
