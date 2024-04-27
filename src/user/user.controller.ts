import express from 'express'
import authentication from '../middlewares/authentication'
import ApiError from '../utils/apiError'
import * as service from './user.service'
import upload from '../middlewares/upload-image'

const router = express.Router()

router.patch('/update-password/:id', authentication, async (req, res, next) => {
  const { newPassword, password } = req.body
  const { id } = req.params

  try {
    if (!id) throw new ApiError('User id is required', 400)
    if (!newPassword || !password) {
      throw new ApiError('Old and new password are required', 400)
    }

    await service.editPassword(password, newPassword, id)

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    })
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode))
    } else {
      next(new ApiError('Internal server error', 500))
    }
  }
})

router.get('/address/:id', authentication, async (req, res, next) => {
  const { id } = req.params

  try {
    if (!id) throw new ApiError('User id is required', 400)
    const address = await service.getAllAddressUser(id)

    res.status(200).json({
      success: true,
      message: 'Address fetched successfully',
      data: address,
    })
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode))
    } else {
      next(new ApiError('Internal server error', 500))
    }
  }
})

router.patch('/address/:id/:addressId', authentication, async (req, res, next) => {
  const body = req.body
  const { id, addressId } = req.params

  try {
    if (!id && !addressId) throw new ApiError('User id and address is required', 400)
    await service.updateAddress(id, addressId, body)

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
    })
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode))
    } else {
      next(new ApiError('Internal server error', 500))
    }
  }
})

router.post('/address/:id', authentication, async (req, res, next) => {
  const body = req.body
  const { id } = req.params
  try {
    if (!id) throw new ApiError('User id is required', 400)

    await service.addNewAddress(id, body)
    res.status(201).json({
      success: true,
      message: 'Address created successfully',
    })
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode))
    } else {
      next(new ApiError('Internal server error', 500))
    }
  }
})

router.delete('/address/:id/:addressId', authentication, async (req, res, next) => {
  const { id, addressId } = req.params
  try {
    if (!id && !addressId) throw new ApiError('User id and address is required', 400)
    await service.removeAddress(id, addressId)
    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
    })
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode))
    } else {
      next(new ApiError('Internal server error', 500))
    }
  }
})

router.patch('/:id', authentication, upload.single('image'), async (req, res, next) => {
  const body = req.body
  const file = req.file
  const { id } = req.params
  try {
    if (!id) throw new ApiError('User id is required', 400)
    await service.updateUser(body, id, file)

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
    })
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode))
    } else {
      next(new ApiError('Internal server error', 500))
    }
  }
})

router.get('/', authentication, async (req, res, next) => {
  try {
    const users = await service.getAllUser()
    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: users,
    })
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode))
    } else {
      next(new ApiError('Internal server error', 500))
    }
  }
})
router.get('/:id', authentication, async (req, res, next) => {
  const { id } = req.params

  try {
    if (!id) throw new ApiError('User id is required', 400)
    const user = await service.getUserById(id)
    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: user,
    })
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode))
    } else {
      next(new ApiError('Internal server error', 500))
    }
  }
})

const userController = router

export default userController
