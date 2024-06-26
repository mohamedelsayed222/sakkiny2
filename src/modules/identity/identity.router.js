import {Router} from 'express'
import * as identityController from './Identity.controller.js'
import { isAuth } from '../../middlewares/auth.js'
import { asyncHandler } from '../../utils/errorHandling.js'
import { multerCloudFunction } from '../../services/multerCloud.js'
import { allowedExtensions } from '../../utils/allowedExtinsions.js'
const router= Router()

router.get("/",(req,res,next)=>{
    res.send('Hello Identity')
})
router.post('/sendcode',isAuth(),asyncHandler(identityController.sendVerificationNumber))
router.post('/verifyIdentity',isAuth(),multerCloudFunction(allowedExtensions.Image).fields([
    { name: 'cameraImage', maxCount: 1 },
    { name: 'frontIDImage', maxCount: 1 },
    { name: 'backIDImage', maxCount: 1 },
  ]),asyncHandler(identityController.verifyIdentity))


export default router
