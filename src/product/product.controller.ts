import express from 'express'
import authentication from '../middlewares/authentication'
import ApiError from '../utils/apiError'
import upload from '../middlewares/upload-image'
import * as productService from './product.service'
import { authorizationOwner } from '../middlewares/authorization'

const router = express.Router()

router.post('/', authentication, upload.single('image'), async (req, res, next) => {
  const body = req.body
  const file = req.file
  try {
    if (
      !body.name ||
      !body.price ||
      !body.category ||
      !body.description ||
      !body.size ||
      !body.stock ||
      !file ||
      !body.condition ||
      !body.weight ||
      !body.length ||
      !body.width ||
      body.colors === '' ||
      !body.colors
    ) {
      throw new ApiError('all fields are required', 400)
    }
    await productService.createProduct(req.user?.id as string, body, file)

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
    })
  } catch (error: unknown) {
    console.log(error)
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode))
    } else {
      next(new ApiError('Internal server error', 500))
    }
  }
})

router.get('/', async (req, res, next) => {
  try {
    const products = await productService.getAllProducts()
    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: products,
    })
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode))
    } else {
      next(new ApiError('Internal server error', 500))
    }
  }
})

router.get('/:id', async (req, res, next) => {
  const id = req.params.id
  try {
    if (!id) {
      throw new ApiError('id is required', 400)
    }
    const product = await productService.getProductById(id)
    res.status(200).json({
      success: true,
      message: 'Product fetched successfully',
      data: product,
    })
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode))
    } else {
      next(new ApiError('Internal server error', 500))
    }
  }
})

router.patch('/:id', authentication, authorizationOwner, async (req, res, next) => {
  const { id } = req.params
  const body = req.body
  try {
    if (!id) {
      throw new ApiError('id is required', 400)
    }
    await productService.updateProduct(id, body)
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
    })
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode))
    } else {
      next(new ApiError('Internal server error', 500))
    }
  }
})

router.delete('/:id', authentication, authorizationOwner, async (req, res, next) => {
  const { id } = req.params
  try {
    if (!id) {
      throw new ApiError('id is required', 400)
    }
    await productService.deleteProduct(id)
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    })
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode))
    } else {
      next(new ApiError('Internal server error', 500))
    }
  }
})

router.post('/image/:id', authentication, authorizationOwner, upload.single('image'), async (req, res, next) => {
  const { id } = req.params
  const file = req.file

  try {
    if (!id) {
      throw new ApiError('id is required', 400)
    }
    await productService.addNewImage(id, req.user?.id as string, file as Express.Multer.File)
    res.status(201).json({
      success: true,
      message: 'Add image product successfully',
    })
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode))
    } else {
      next(new ApiError('Internal server error', 500))
    }
  }
})

router.get('/image/:imageId', async (req, res, next) => {
  const { imageId } = req.params
  try {
    const image = await productService.getImageById(imageId)
    res.status(200).json({
      success: true,
      message: 'Product fetched successfully',
      data: image,
    })
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode))
    } else {
      next(new ApiError('Internal server error', 500))
    }
  }
})

router.delete('/image/:imageId', authentication, async (req, res, next) => {
  const { imageId } = req.params
  try {
    await productService.deleteImageProduct(imageId)
    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    })
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode))
    } else {
      next(new ApiError('Internal server error', 500))
    }
  }
})

router.patch('/archive/:id', authentication, authorizationOwner, async (req, res, next) => {
  const { id } = req.params
  try {
    if (!id) {
      throw new ApiError('id is required', 400)
    }

    await productService.archiveProduct(id)

    res.status(200).json({
      success: true,
      message: 'Product archived successfully',
    })
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode))
    } else {
      next(new ApiError('Internal server error', 500))
    }
  }
})

const productController = router
export default productController
