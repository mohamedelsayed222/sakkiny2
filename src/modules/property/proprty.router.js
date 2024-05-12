import {Router} from 'express'
import { isAuth } from '../../middlewares/auth.js'
import * as propertyController from './Property.controller.js'
import { asyncHandler } from '../../utils/errorHandling.js'
const router= Router()

router.get('/',isAuth(),asyncHandler(propertyController.getAllProperties))
router.get('/search',isAuth(),asyncHandler(propertyController.searchProperty))
router.get('/recommend',isAuth(),asyncHandler(propertyController.recommendProperty))
router.get('/:propertyId',isAuth(),asyncHandler(propertyController.getSpecificProperty))

export default router