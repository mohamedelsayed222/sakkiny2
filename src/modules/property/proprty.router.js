import {Router} from 'express'
import { isAuth } from '../../middlewares/auth.js'
import * as propertyController from './Property.controller.js'
import { asyncHandler } from '../../utils/errorHandling.js'
const router= Router()

router.get('/',asyncHandler(propertyController.getAllProperties))
router.get('/search',asyncHandler(propertyController.searchProperty))
router.get('/recommend',isAuth(),asyncHandler(propertyController.recommendProperty))
router.get('/:propertyId',isAuth(),asyncHandler(propertyController.getSpecificProperty))
router.put('/:propertyId/like',isAuth(),asyncHandler(propertyController.likeproperty))
router.get('/likes',isAuth(),asyncHandler(propertyController.getlikedProperties))
export default router