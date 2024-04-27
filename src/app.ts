import express, { Express } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import ApiError from './utils/apiError'
import errorHandler from './utils/error-handler'
import authController from './auth/auth.controller'
import userController from './user/user.controller'
import productController from './product/product.controller'
import adminController from './admin/admin.controller'
import orderController from './order/order.controller'
import categoryController from './category/category.controller'

const app: Express = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.use(cookieParser())

app.use('/api/v1/auths', authController)
app.use('/api/v1/users', userController)
app.use('/api/v1/products', productController)
app.use('/api/v1/admin', adminController)
app.use('/api/v1/orders', orderController)
app.use('/api/v1/categories', categoryController)

app.all('*', (req, res, next) => {
  next(new ApiError(`Routes does not exist`, 404))
})

app.use(errorHandler)

export default app
