import { NextFunction, Request, Response } from 'express'
import ApiError from '../utils/apiError'
import { getProductById } from '../product/product.service'

export const authorizationRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return next(new ApiError('You are not authorized to access this resource', 403))
    }
    next()
  }
}

export const authorizationOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const product = await getProductById(id)

    if (req.user?.id !== product.seller_id) {
      throw new ApiError('You are not authorized to access this resource', 403)
    }
    next()
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode))
    } else {
      next(new ApiError('Internal server error', 500))
    }
  }
}
