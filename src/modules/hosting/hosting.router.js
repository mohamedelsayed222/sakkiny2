import {Router} from 'express'
import { isAuth } from '../../middlewares/auth.js'
import * as hostingController from './Hosting.controller.js'
import { multerCloudFunction } from '../../services/multerCloud.js'
import { allowedExtensions } from '../../utils/allowedExtinsions.js'
import { asyncHandler } from '../../utils/errorHandling.js'
import validationCoreFunction from "../../middlewares/validation.js"
import * as validators from './hosting.vlaidation.js'
const router= Router()

router.post('/add',
    isAuth(),
    multerCloudFunction(allowedExtensions.Image).array('PropertyImages'),
    validationCoreFunction(validators.addProperty),
    asyncHandler(hostingController.addProperty)
)
router.put('/update/:propertyid',
    isAuth(),
    multerCloudFunction(allowedExtensions.Image).array('PropertyImages'),
    validationCoreFunction(validators.updateProperty),
    asyncHandler(hostingController.updateProperty)
)
router.delete('/update/:propertyid',
    isAuth(),
    // multerCloudFunction(allowedExtensions.Image),
    asyncHandler(hostingController.deletePropertyImage)
)
router.delete('/delete/:propertyid',
    isAuth(),
    // multerCloudFunction(allowedExtensions.Image),
    asyncHandler(hostingController.deleteProperty)
)



export default router