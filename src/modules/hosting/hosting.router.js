import {Router} from 'express'
import { isAuth } from '../../middlewares/auth.js'
import * as hostingController from './Hosting.controller.js'
import { multerCloudFunction } from '../../services/multerCloud.js'
import { allowedExtensions } from '../../utils/allowedExtinsions.js'
import { asyncHandler } from '../../utils/errorHandling.js'
import {validationCoreFunction} from "../../middlewares/validation.js"
import * as validators from './hosting.validation.js'
const router= Router()

router.post('/add',
    isAuth(),
    multerCloudFunction().array('propertyImages'),
    validationCoreFunction(validators.addProperty),
    asyncHandler(hostingController.addProperty)
)
router.put('/update/:propertyid',
    isAuth(),
    multerCloudFunction().array('propertyImages'),
    validationCoreFunction(validators.updateProperty),
    asyncHandler(hostingController.updateProperty)
)
router.delete('/update/:propertyid/deleteimage',
    isAuth(),
    asyncHandler(hostingController.deletePropertyImage)
)
router.delete('/delete/:propertyid',
    isAuth(),
    asyncHandler(hostingController.deleteProperty)
)



export default router