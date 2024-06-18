import {Router} from 'express'
import { isAuth } from '../../middlewares/auth.js'
import * as serviceController from './Service.controller.js'
import { multerCloudFunction } from '../../services/multerCloud.js'
import { allowedExtensions } from '../../utils/allowedExtinsions.js'
import { asyncHandler } from '../../utils/errorHandling.js'
import {validationCoreFunction} from "../../middlewares/validation.js"
import * as validators from './service.validation.js'
const router=Router()

router.post("/add",
isAuth(),
multerCloudFunction().array('Images'),
validationCoreFunction(validators.addService),
asyncHandler(serviceController.addService)
)

router.get('/',asyncHandler(serviceController.getService))

router.put("/update/:serviceId",
isAuth(),
multerCloudFunction().array('Images'),
validationCoreFunction(validators.updateService),
asyncHandler(serviceController.updateService)
)

router.delete("/delete/:serviceId",
    isAuth(),
    asyncHandler(serviceController.deleteService)
)

router.put("/deleteimage/:serviceId",
    isAuth(),
    asyncHandler(serviceController.deleteImage)
)

router.get('/search',asyncHandler(serviceController.searchService))


router.get('/:serviceId',asyncHandler(serviceController.getSpecificService))

export default router

