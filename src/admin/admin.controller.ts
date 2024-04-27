import express from 'express'
import ApiError from '../utils/apiError'
import authentication from '../middlewares/authentication'
import { authorizationRole } from '../middlewares/authorization'
import * as userService from '../user/user.service'
import { removeUser } from './admin.service'

const router = express.Router()

router.get('/users', authentication, authorizationRole('ADMIN'), async (req, res, next) => {
  try {
    const users = await userService.getAllUser()

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

router.get('/users/:id', authentication, authorizationRole('ADMIN'), async (req, res, next) => {
  const { id } = req.params
  try {
    if (!id) throw new ApiError('User id is required', 400)
    const user = await userService.getUserById(id)
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

router.patch('/users/:id', authentication, authorizationRole('ADMIN'), async (req, res, next) => {
  const body = req.body
  const { id } = req.params
  try {
    if (!id) throw new ApiError('User id is required', 400)
    await userService.updateUser(body, id)
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

router.delete('/users/:id', authentication, authorizationRole('ADMIN'), async (req, res, next) => {
  const { id } = req.params
  try {
    if (!id) throw new ApiError('User id is required', 400)
    await removeUser(id)
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    })
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode))
    } else {
      next(new ApiError('Internal server error', 500))
    }
  }
})

const adminController = router
export default adminController
