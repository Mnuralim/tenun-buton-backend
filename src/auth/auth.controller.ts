import express from 'express'
import ApiError from '../utils/apiError'
import * as service from './auth.service'
import { LoginBody, RegisterBody } from '../../types/types'

const router = express.Router()

router.post('/register', async (req, res, next) => {
  const { email, password } = req.body as RegisterBody
  try {
    if (!email || !password) {
      throw new ApiError('Email and password are required', 400)
    }
    await service.register({ email, password })

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
    })
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode))
    } else {
      next(new ApiError('Internal server error', 500))
    }
  }
})

router.post('/login-credentials', async (req, res, next) => {
  const { email, password } = req.body as LoginBody
  try {
    if (!email || !password) {
      throw new ApiError('Email and password are required', 400)
    }

    const { payloadData, refreshToken } = await service.login({ email, password })

    res.cookie('refreshToken', refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
    })

    res.status(200).json({
      success: true,
      message: 'Login success',
      data: { ...payloadData },
    })
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode))
    } else {
      next(new ApiError('Internal server error', 500))
    }
  }
})

router.post('/login-google', async (req, res, next) => {
  const tokenId = req.headers.authorization
  try {
    if (!tokenId) {
      throw new ApiError('Token id is required', 400)
    }

    const { accesToken, payloadData, refreshToken } = await service.loginGoogle(tokenId)

    res.cookie('refreshToken', refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
    })

    res.status(200).json({
      success: true,
      message: 'Login success',
      data: { ...payloadData, accesToken },
    })
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode))
    } else {
      next(new ApiError('Internal server error', 500))
    }
  }
})

router.get('/verify-email/:token', async (req, res, next) => {
  const { token } = req.params
  try {
    if (!token) {
      throw new ApiError('Token is required', 400)
    }

    await service.verifyEmail(token)

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    })
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode))
    } else {
      next(new ApiError('Internal server error', 500))
    }
  }
})

router.post('/forgot-password', async (req, res, next) => {
  const { email } = req.body

  try {
    if (!email) {
      throw new ApiError('Email is required', 400)
    }

    await service.forgotPassword(email)

    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
    })
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode))
    } else {
      next(new ApiError('Internal server error', 500))
    }
  }
})

router.patch('/reset-password/:token', async (req, res, next) => {
  const { token } = req.params
  const { password } = req.body
  try {
    if (!token) {
      throw new ApiError('Token is required', 400)
    }

    if (!password) {
      throw new ApiError('Password is required', 400)
    }

    await service.resetPassword(token, password)

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    })
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode))
    } else {
      next(new ApiError('Internal server error', 500))
    }
  }
})

const authController = router

export default authController
