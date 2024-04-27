import express from 'express'
import * as CategoryService from './category.service'
import ApiError from '../utils/apiError'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const categories = await CategoryService.getAllCategory()
    res.status(200).json({
      success: true,
      message: 'Category fetched successfully',
      data: categories,
    })
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode))
    } else {
      next(new ApiError('Internal server error', 500))
    }
  }
})

const categoryController = router
export default categoryController
