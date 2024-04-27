import { compare, hash } from 'bcrypt'
import ApiError from '../utils/apiError'
import * as userRepository from './user.repository'
import { updatePassword } from '../auth/auth.repository'
import { AddressBody, UpdateUserBody } from '../../types/types'
import imagekit from '../utils/imagekit'

export const editPassword = async (oldPassword: string, newPassword: string, userId: string) => {
  const user = await userRepository.findUserById(userId, true)
  if (!user) throw new ApiError('User not found', 404)

  const checkedPassword = await compare(oldPassword, user.auth.password as string)

  if (!checkedPassword) throw new ApiError('Password is wrong', 400)

  const hashedPassword = await hash(newPassword, 10)
  const update = await updatePassword(user.auth_id, hashedPassword)

  return update
}

export const updateUser = async (body: UpdateUserBody, userId: string, file?: Express.Multer.File) => {
  const user = await userRepository.findUserById(userId)
  if (!user) throw new ApiError('User not found', 404)

  if (body.mobile) {
    const checkMobile = await userRepository.findUserByMobile(body.mobile)
    if (checkMobile && user.mobile !== body.mobile) throw new ApiError('Mobile number already used', 400)
  }

  if (file) {
    const uploadImage = await imagekit.upload({
      file: file.buffer,
      fileName: `${file.originalname}-${user.id}-${Date.now()}`,
      folder: `tenunbuton/${user.id}/thumbnail`,
    })
    await userRepository.updateUserById(userId, body, uploadImage.url)
  } else {
    await userRepository.updateUserById(userId, body)
  }
}

export const addNewAddress = async (userId: string, body: AddressBody) => {
  const user = await userRepository.findUserById(userId)
  if (!user) throw new ApiError('User not found', 404)
  const address = await userRepository.createAddress(userId, body)
  return address
}

export const updateAddress = async (userId: string, addressId: string, body: AddressBody) => {
  const user = await userRepository.findUserById(userId)
  if (!user) throw new ApiError('User not found', 404)
  const address = await userRepository.findAddressById(addressId)
  if (!address) throw new ApiError('Address not found', 404)

  await userRepository.editAddress(addressId, body)
}

export const removeAddress = async (userId: string, addressId: string) => {
  const user = await userRepository.findUserById(userId)
  if (!user) throw new ApiError('User not found', 404)
  const address = await userRepository.findAddressById(addressId)
  if (!address) throw new ApiError('Address not found', 404)

  await userRepository.deleteAddress(addressId)
}

export const getAllAddressUser = async (userId: string) => {
  const user = await userRepository.findUserById(userId)
  if (!user) throw new ApiError('User not found', 404)

  const address = await userRepository.getAllAdress(userId)
  return address
}

export const getAllUser = async () => {
  const users = await userRepository.findAllUsers()
  return users
}

export const getUserById = async (id: string) => {
  const user = await userRepository.findUserById(id)
  if (!user) throw new ApiError('User not found', 404)
  return user
}
