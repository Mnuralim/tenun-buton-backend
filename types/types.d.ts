import { Auth, Condition, SizeEnum, User } from '@prisma/client'

type CurrentUser = User & {
  auth?: Auth
}

declare global {
  namespace Express {
    interface Request {
      user: CurrentUser
    }
  }
}

interface Item {
  id: string
  name: string
  price: number
  quantity: number
}

interface PaymentReqBody {
  quantity: number
  totalPrice: number
  items: Item[]
}

interface IRegion {
  id: string
  name: string
}

interface RegisterBody {
  email: string
  password: string
}

interface LoginBody {
  email: string
  password: string
}

interface NodemailerData {
  to: string
  subject: string
  text: string
  html: string
}

interface AuthenticationPayload {
  email: string
  id: string
  username: string
  iat: number
  exp: number
}

interface UpdateUserBody {
  firstname?: string
  lastname?: string
  mobile?: string
}

interface AddressBody {
  province_code?: string
  province?: string
  city_code?: string
  city?: string
  subdistrict_code?: string
  subdistrict?: string
  postal_code?: string
  address?: string
  village_code?: string
  village?: string
  country?: string
}

interface ProductBody {
  name: string
  price: number
  description: string
  condition: Condition
  stock: number
  length: number
  width: number
  weight: number
  category: string
  colors: string
  size: string
}

interface OrderItem {
  product_name: string
  total_price: number
  price: number
  product_id: string
  total_product: number
  size: SizeEnum
  color: string
  weight: number
  length: number
  width: number
}

interface OrderCallback {
  order_id: string
  status_code: string
  gross_amount: string
  signature_key: string
  transaction_status: string
  payment_type: string
}
