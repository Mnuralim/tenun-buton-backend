// @ts-ignore
import midtransClient from 'midtrans-client'
import crypto from 'crypto'
import { CurrentUser, OrderCallback, OrderItem } from '../../types/types'
import { getProductById } from '../product/product.service'
import * as orderRepository from './order.repository'
import ApiError from '../utils/apiError'

export const createOrder = async (
  buyer: CurrentUser,
  items: OrderItem[],
  shippingCost: number,
  courier: string,
  addressId: string
) => {
  const fee = 1000
  let totalPrice = 0
  const itemsAfterCalc = []
  for (const item of items) {
    const product = await getProductById(item.product_id)
    if (product.stock < parseInt(item.total_product.toString())) {
      throw new Error('Product stock is not enough')
    }
    totalPrice += product.price * parseInt(item.total_product.toString())
    itemsAfterCalc.push({
      total_price: product.price * parseInt(item.total_product.toString()),
      product_id: item.product_id,
      color: item.color,
      length: item.length,
      width: item.width,
      weight: item.weight,
      size: item.size,
      total_product: parseInt(item.total_product.toString()),
      product_name: product.name,
      price: product.price,
    })
  }

  const totalPurchase = totalPrice + shippingCost
  const totalInvoice = totalPurchase + fee

  const order = await orderRepository.addNewOrder(
    buyer.id,
    itemsAfterCalc,
    shippingCost,
    courier,
    addressId,
    totalPrice,
    totalPurchase,
    totalInvoice,
    fee
  )

  const snap = new midtransClient.Snap({
    isProduction: false,
    clientKey: process.env.MIDTRANS_CLIENT_KEY as string,
    serverKey: process.env.MIDTRANS_SERVER_KEY as string,
  })

  const address = await getAddressById(addressId)

  const transaction = await snap.createTransaction({
    customer_details: {
      email: buyer.auth?.email as string,
      first_name: buyer.firstname as string,
      phone: buyer.mobile as string,
    },
    item_details: [
      ...itemsAfterCalc.map((item) => ({
        id: item.product_id,
        price: item.price,
        quantity: item.total_product,
        name: item.product_name,
      })),
      {
        id: 'shipping_cost',
        price: shippingCost,
        quantity: 1,
        name: 'Shipping Cost',
      },
      {
        id: 'fee',
        price: fee,
        quantity: 1,
        name: 'Fee',
      },
    ],
    transaction_details: {
      gross_amount: totalInvoice,
      order_id: order.id,
    },
    shipping_address: {
      address: address.address as string,
      city: address.city as string,
      email: buyer.auth?.email as string,
      first_name: buyer.firstname as string,
      phone: buyer.mobile as string,
      postal_code: address.postal_code as string,
      country_code: address.country as string,
    },
  })

  return {
    token: transaction.token,
    redirect_url: transaction.redirect_url,
  }
}

export const getAllOrderBuyer = async (userId: string) => {
  const orders = await orderRepository.findOrderByBuyerId(userId)
  return orders
}

export const getAllOrderSeller = async (sellerId: string) => {
  const orders = await orderRepository.findOrderBySellerId(sellerId)
  return orders
}

export const orderCallback = async (body: OrderCallback) => {
  const serverKey = process.env.MIDTRANS_SERVER_KEY as string
  const hashed = crypto
    .createHash('sha512')
    .update(body.order_id + body.status_code + body.gross_amount + serverKey)
    .digest('hex')

  if (body.signature_key === hashed) {
    if (body.transaction_status === 'settlement' || body.transaction_status === 'capture') {
      const order = await orderRepository.findOrderById(body.order_id)
      if (!order) {
        throw new ApiError('Order not found', 400)
      }
      await orderRepository.updateOrderStatus(body.order_id, 'PAID', body.payment_type)
      await orderRepository.updateOrderItem(body.order_id, 'PROCESSING')
    } else if (
      body.transaction_status === 'deny' ||
      body.transaction_status === 'expire' ||
      body.transaction_status === 'cancel'
    ) {
      const order = await orderRepository.findOrderById(body.order_id)
      if (!order) {
        throw new ApiError('Order not found', 400)
      }
      await orderRepository.updateOrderStatus(body.order_id, 'CANCELED', body.payment_type)
      await orderRepository.updateOrderItem(body.order_id, 'CANCELED')
    }
  }
}

export const getAddressById = async (id: string) => {
  const address = await orderRepository.findAddressById(id)
  if (!address) {
    throw new ApiError('Address not found', 404)
  }
  return address
}
