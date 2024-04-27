import { AddressBody, UpdateUserBody } from '../../types/types'
import { db } from '../db'

export const findUserById = async (id: string, showPassword?: boolean) => {
  const user = await db.user.findUnique({
    where: {
      id,
    },
    include: {
      auth: {
        select: {
          id: true,
          email: true,
          username: true,
          created_at: true,
          password: showPassword,
        },
      },
      address: true,
    },
  })

  return user
}

export const findUserByMobile = async (mobile: string) => {
  const user = await db.user.findUnique({
    where: {
      mobile,
    },
  })

  return user
}

export const updateUserById = async (id: string, body: UpdateUserBody, imageUrl?: string) => {
  const user = await db.user.update({
    where: {
      id,
    },
    data: {
      ...body,
      image: imageUrl,
    },
  })
}

export const findAddressById = async (id: string) => {
  const user = await db.address.findUnique({
    where: {
      id,
    },
  })

  return user
}

export const createAddress = async (userId: string, body: AddressBody) => {
  const user = await db.address.create({
    data: {
      ...body,
      user_id: userId,
    },
  })
}

export const editAddress = async (addressId: string, body: AddressBody) => {
  const user = await db.address.update({
    where: {
      id: addressId,
    },
    data: body,
  })
}

export const deleteAddress = async (addressId: string) => {
  const user = await db.address.delete({
    where: {
      id: addressId,
    },
  })
}

export const getAllAdress = async (userId: string) => {
  const user = await db.address.findMany({
    where: {
      user_id: userId,
    },
  })

  return user
}

export const findAllUsers = async () => {
  const users = await db.user.findMany({
    where: {
      is_active: true,
    },
    include: {
      auth: {
        select: {
          id: true,
          email: true,
          username: true,
          created_at: true,
        },
      },
      address: true,
    },
  })
  return users
}
