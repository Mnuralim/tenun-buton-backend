import { OrderStatus, PaymentStatus } from '@prisma/client'
import { OrderItem } from '../../types/types'
import { db } from '../db'

export const addNewOrder = async (
  buyerId: string,
  items: OrderItem[],
  shippingCost: number,
  courier: string,
  addressId: string,
  totalPrice: number,
  totalPurchase: number,
  totalInvoice: number,
  fee: number
) => {
  const order = await db.order.create({
    data: {
      buyer_id: buyerId,
      shipping_cost: shippingCost,
      fee,
      courier,
      address_id: addressId,
      total_price: totalPrice,
      total_purchase: totalPurchase,
      total_invoice: totalInvoice,
      item: {
        create: items.map((item) => ({
          color: item.color,
          length: item.length,
          width: item.width,
          weight: item.weight,
          size: item.size,
          total_product: item.total_product,
          total_price: item.total_price,
          product_id: item.product_id,
          name_product: item.product_name,
          price: item.price,
        })),
      },
    },
  })

  return order
}

export const findOrderById = async (id: string) => {
  const order = await db.order.findUnique({
    where: {
      id,
    },
  })

  return order
}

export const updateOrderStatus = async (id: string, status: PaymentStatus, paymentMethod?: string) => {
  const order = await db.order.update({
    where: {
      id,
    },
    data: {
      payment_status: status,
      payment_method: paymentMethod,
    },
  })

  return order
}

export const findOrderByBuyerId = async (userId: string) => {
  const order = await db.order.findMany({
    where: {
      buyer_id: userId,
    },
    include: {
      item: true,
    },
  })

  return order
}

export const findOrderBySellerId = async (sellerId: string) => {
  const order = await db.order.findMany({
    where: {
      item: {
        every: {
          product: {
            seller_id: sellerId,
          },
        },
      },
    },
    include: {
      item: true,
    },
  })

  return order
}

export const updateOrderItem = async (id: string, orderStatus: OrderStatus) => {
  await db.item.updateMany({
    where: {
      order_id: id,
    },
    data: {
      order_status: orderStatus,
    },
  })
}

export const findAddressById = async (id: string) => {
  const address = await db.address.findUnique({
    where: {
      id,
    },
  })

  return address
}
