import express from 'express'
import authentication from '../middlewares/authentication'
import ApiError from '../utils/apiError'
import { OrderCallback, OrderItem } from '../../types/types'
import * as orderService from './order.service'

const router = express.Router()

router.post('/', authentication, async (req, res, next) => {
  const {
    courier,
    items,
    shippingCost,
    addressId,
  }: {
    items: OrderItem[]
    shippingCost: number
    courier: string
    addressId: string
  } = req.body

  try {
    if (!items || !shippingCost || !courier || !addressId) {
      throw new ApiError('all fields are required', 400)
    }
    const { redirect_url, token } = await orderService.createOrder(req.user, items, shippingCost, courier, addressId)
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        redirect_url,
        token,
      },
    })
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode))
    } else {
      next(new ApiError('Internal server error', 500))
    }
  }
})

router.post('/callback', async (req, res, next) => {
  const body: OrderCallback = req.body

  try {
    await orderService.orderCallback(body)
    res.status(200).json({
      success: true,
      message: 'Order callback successfully',
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
    const orders = await orderService.getAllOrderBuyer(req.user.id)

    res.status(200).json({
      success: true,
      message: 'Get all orders successfully',
      data: orders,
    })
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode))
    } else {
      next(new ApiError('Internal server error', 500))
    }
  }
})

router.get('/seller', authentication, async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrderSeller(req.user.id)

    res.status(200).json({
      success: true,
      message: 'Get all orders successfully',
      data: orders,
    })
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode))
    } else {
      next(new ApiError('Internal server error', 500))
    }
  }
})

const orderController = router
export default orderController
