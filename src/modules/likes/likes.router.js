import {Router} from 'express'
import { isAuth } from '../../middlewares/auth.js'
import { multerCloudFunction } from '../../services/multerCloud.js'
import { allowedExtensions } from '../../utils/allowedExtinsions.js'
import { asyncHandler } from '../../utils/errorHandling.js'
import {validationCoreFunction} from "../../middlewares/validation.js"
import * as validators from './likes.validation.js'
const router=Router()



export default router
