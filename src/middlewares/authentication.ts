import type { Response, NextFunction, Request } from 'express'
import jwt from 'jsonwebtoken'
import ApiError from '../utils/apiError'
import { db } from '../db'
import { AuthenticationPayload, CurrentUser } from '../../types/types'

const authentication = async (req: Request, res: Response, next: NextFunction) => {
  const bearerToken = req.headers.authorization

  if (!bearerToken) {
    return next(new ApiError('No token', 401))
  }

  const token = bearerToken.split(' ')[1]
  const payload = jwt.verify(token, process.env.JWT_SECRET as string) as AuthenticationPayload

  const user = await db.user.findUnique({
    where: {
      id: payload.id,
    },
    include: {
      auth: true,
    },
  })

  req.user = user as CurrentUser

  next()
}

export default authentication
