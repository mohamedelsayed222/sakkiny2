import {Router} from 'express'
import { isAuth } from '../../middlewares/auth.js'
import { multerCloudFunction } from '../../services/multerCloud.js'
import { allowedExtensions } from '../../utils/allowedExtinsions.js'
import { asyncHandler } from '../../utils/errorHandling.js'
import {validationCoreFunction} from "../../middlewares/validation.js"
import * as validators from './admin.validation.js'
const router=Router()

//signup 
router.post("/signup",
    validationCoreFunction(signup),authController.signup)

//login
router.post("/login",
    validationCoreFunction(login),
    authController.login)
//get counts


//check identity 

//verify or reject identity 


//get users //get properties //get services 

//Delete 


//check reports 


//send notification 





export default router
