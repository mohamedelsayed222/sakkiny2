import {Router} from 'express'
import { isAuth } from '../../middlewares/auth.js'
import { multerCloudFunction } from '../../services/multerCloud.js'
import {validationCoreFunction} from "../../middlewares/validation.js"
import * as validators from './admin.validation.js'
import * as adminController from "./Admin.controller.js"
import { isAuthAdmin } from '../../middlewares/authAdmin.js'
import { asyncHandler } from '../../utils/errorHandling.js';

const router=Router()

//signup 
router.post("/register",  //1
    // isAuthAdmin(),
    // validationCoreFunction(signup),
   asyncHandler(adminController.signup))

//confirmEmail
router.get("/confirmEmail/:token",asyncHandler(adminController.confirmEmail)) //2

//login
router.post("/login",   //3
    // validationCoreFunction(login),
    asyncHandler(adminController.login))
    //get counts
router.get('/properties',isAuthAdmin(),asyncHandler(adminController.getProperties)) //5
router.get('/services',isAuthAdmin(),asyncHandler(adminController.getServices))  //6
    

//check identity
// router.get("/identity",  //4
//     isAuthAdmin(),
//     adminController.getIdentities)

//verify or reject identity 


//get users //get properties //get services 

//Delete 


//check reports 


//send notification 




export default router
