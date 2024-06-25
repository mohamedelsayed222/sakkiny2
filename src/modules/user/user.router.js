import { Router } from "express";
import * as userController from './User.controller.js' 
import { multerCloudFunction } from "../../services/multerCloud.js";
import { allowedExtensions } from "../../utils/allowedExtinsions.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { isAuth } from "../../middlewares/auth.js";
const router=Router()

router.get('/',userController.hellouser)
router.post('/uploadProfilePic',
    isAuth(),
    multerCloudFunction(allowedExtensions.Image).single('ProfilePicture'),
    asyncHandler(userController.uploadProfilePic))
router.get('/profile',isAuth(),userController.getUser)
router.get('/myProperties',isAuth(),asyncHandler(userController.getProperties))
router.get('/myService',isAuth(),asyncHandler(userController.getService))

// get user info
// update user information


export default router