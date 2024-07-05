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
router.post("/register",  
    // isAuthAdmin(),
    // validationCoreFunction(signup),
   asyncHandler(adminController.signup))

//confirmEmail
router.get("/confirmEmail/:token",asyncHandler(adminController.confirmEmail)) 

//login
router.post("/login",   
    // validationCoreFunction(login),
    asyncHandler(adminController.login))
router.get("/counts",isAuthAdmin,
        asyncHandler(adminController.getCounts)
    )
router.get('/properties',isAuthAdmin(),asyncHandler(adminController.getProperties))
router.get('/services',isAuthAdmin(),asyncHandler(adminController.getServices))  
router.get("/identities",  
    isAuthAdmin(),
    asyncHandler(adminController.getAllIdentities))
router.get("/identities/unverified",  
        isAuthAdmin(),
        asyncHandler(adminController.getUnverifiedIdentities))
router.get("/users",  
    isAuthAdmin(),
    asyncHandler(adminController.getUsers))

router.put("/checkIdentity/:identityId",isAuthAdmin(),
asyncHandler(adminController.checkIdentity)
)
router.get("/reports",  
    isAuthAdmin(),
    asyncHandler(adminController.getAllreports))

//check reports 
router.put("/reports/:reportId",isAuthAdmin(),
asyncHandler(adminController.respondToReport)
)





export default router
