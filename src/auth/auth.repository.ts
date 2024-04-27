import { db } from '../db'

interface AddUserProps {
  username: string
  email: string
  password: string
  email_verify_token?: string
  is_active?: boolean
}

export const addUser = async (data: AddUserProps) => {
  const auth = await db.auth.create({
    data,
  })

  const user = await db.user.create({
    data: {
      auth_id: auth.id,
    },
  })

  return user
}

export const findUserByEmail = async (email: string) => {
  const user = await db.auth.findFirst({
    where: {
      AND: {
        email,
        user: {
          is_active: true,
        },
      },
    },
    include: {
      user: true,
    },
  })

  return user
}

export const findUserByEmailVerifyToken = async (token: string) => {
  const user = await db.auth.findFirst({
    where: {
      AND: {
        email_verify_token: token,
        is_verified: false,
      },
    },
  })

  return user
}

export const updateVerfiedEmail = async (email: string) => {
  const user = await db.auth.update({
    where: {
      email,
    },
    data: {
      is_verified: true,
      email_verify_token: '',
    },
  })
  return user
}

export const updateResetPasswordToken = async (email: string, token: string, resetExpired: Date) => {
  const user = await db.auth.update({
    where: {
      email,
    },
    data: {
      password_reset_expired: resetExpired,
      password_reset_token: token,
    },
  })

  return user
}

export const findUserByResetPaswordToken = async (token: string) => {
  const user = await db.auth.findFirst({
    where: {
      AND: {
        password_reset_token: token,
        password_reset_expired: {
          gte: new Date(),
        },
        is_verified: true,
      },
    },
  })

  return user
}

export const updatePassword = async (id: string, password: string) => {
  const user = await db.auth.update({
    where: {
      id,
    },
    data: {
      password,
      password_reset_expired: null,
      password_reset_token: null,
    },
  })

  return user
}
