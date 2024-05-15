import { Router } from "express";
const router=Router()
import * as authController from "./auth.controller.js"
// import { validation } from "../../middleware/validation.js";
import { login ,signup} from "./auth.validation.js";
import { validationCoreFunction } from "../../middlewares/validation.js";
import { isAuth } from "../../middlewares/auth.js";



    router.post("/signup",
    validationCoreFunction(signup),authController.signup)
    router.get("/confirmEmail/:token",authController.confirmEmail)
    router.get("/resendConfirmEmail/:token",authController.resendConfirmEmail)
    router.post("/forgetpassword",authController.forgetPassword)
    router.post("/resetPassword/:token",authController.resetPassword)
    router.post("/login",
    // validationCoreFunction(login),
    authController.login)
    router.post("/resetPassword/",isAuth(),authController.resetPassword)



export default router 
