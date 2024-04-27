import { compare, hash } from 'bcrypt'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import { LoginBody } from '../../types/types'
import ApiError from '../utils/apiError'
import sendEmail from '../utils/nodemailer'
import generateRandomString from '../utils/random-password'
import * as repository from './auth.repository'
import * as emailMessage from '../utils/email-message'
import generateToken from '../utils/generate-token'

interface RegisterProps {
  email: string
  password: string
}

export const register = async (data: RegisterProps) => {
  const isRegistered = await repository.findUserByEmail(data.email)
  if (isRegistered) throw new ApiError('Email already registered', 400)

  const username = data.email.split('@')[0]
  const hashedPassword = await hash(data.password, 10)

  const verifyToken = generateToken()

  const user = await repository.addUser({
    username,
    email: data.email,
    password: hashedPassword,
    email_verify_token: verifyToken,
  })

  await sendEmail({
    html: emailMessage.verifyEmailMessage(verifyToken),
    subject: 'Verfication email',
    text: `Hi ${username} please verify your email address to continue`,
    to: data.email,
  })

  return user
}

export const login = async (data: LoginBody) => {
  const isRegistered = await repository.findUserByEmail(data.email)
  if (!isRegistered) throw new ApiError('Email not registered', 400)
  const isValidPassword = await compare(data.password, isRegistered.password as string)
  if (!isValidPassword) throw new ApiError('Password is not valid', 400)

  const payload = {
    email: isRegistered.email,
    id: isRegistered.user?.id,
    username: isRegistered.username,
  }

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '3d',
  })

  const refreshToken = jwt.sign(payload, process.env.REFRESHTOKEN_SECRET as string, {
    expiresIn: '7d',
  })

  const payloadData = {
    ...payload,
    accessToken,
  }

  return {
    payloadData,
    refreshToken,
  }
}

export const loginGoogle = async (tokenId: string) => {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
  const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)

  const ticket = await client.verifyIdToken({
    idToken: tokenId.slice(7),
    audience: GOOGLE_CLIENT_ID,
  })

  const payload = ticket.getPayload()

  if (payload?.aud != GOOGLE_CLIENT_ID) {
    throw new ApiError('Token id is not valid', 400)
  }

  const isRegistered = await repository.findUserByEmail(payload?.email as string)

  let userId
  if (!isRegistered) {
    const username = payload?.email?.split('@')[0]
    const randomPassword = generateRandomString()
    const hashedPassword = await hash(randomPassword as string, 10)
    const user = await repository.addUser({
      email: payload?.email as string,
      username: username as string,
      password: hashedPassword,
      is_active: true,
    })
    await sendEmail({
      html: emailMessage.successRegister(randomPassword),
      subject: 'Register Success',
      text: `Hi ${username} your registration is success`,
      to: payload?.email as string,
    })
    userId = user.id
  }

  const payloadData = {
    email: payload?.email as string,
    id: isRegistered ? isRegistered.user?.id : userId,
    username: payload?.name as string,
  }

  const accesToken = jwt.sign(payloadData, process.env.JWT_SECRET as string, {
    expiresIn: '3d',
  })

  const refreshToken = jwt.sign(payloadData, process.env.REFRESHTOKEN_SECRET as string, {
    expiresIn: '7d',
  })

  return {
    payloadData,
    accesToken,
    refreshToken,
  }
}

export const verifyEmail = async (token: string) => {
  const user = await repository.findUserByEmailVerifyToken(token)
  if (!user) throw new ApiError('Token not found', 400)

  const updateVerifyEmail = await repository.updateVerfiedEmail(user.email)
  if (updateVerifyEmail) {
    await sendEmail({
      html: emailMessage.successRegister(),
      subject: 'Register Success',
      text: `Hi ${user.username} your registration is success`,
      to: user.email,
    })
  }
}

export const forgotPassword = async (email: string) => {
  const user = await repository.findUserByEmail(email)
  if (!user) throw new ApiError('Email not found', 400)
  const resetPasswordToken = generateToken()
  const passwordResetExpiry = new Date(Date.now() + 10 * 60 * 1000)

  const update = await repository.updateResetPasswordToken(email, resetPasswordToken, passwordResetExpiry)

  if (update) {
    await sendEmail({
      html: emailMessage.forgotPasswordMessage(resetPasswordToken),
      subject: 'Reset Password',
      text: `Hi ${user.username} please reset your password to continue`,
      to: user.email,
    })
  }
}

export const resetPassword = async (resetPasswordToken: string, newPassword: string) => {
  const user = await repository.findUserByResetPaswordToken(resetPasswordToken)
  if (!user) throw new ApiError('Password reset token is invalid or has expired', 400)

  const hashedPassword = await hash(newPassword, 10)
  const reset = await repository.updatePassword(user.id, hashedPassword)

  if (reset) {
    await sendEmail({
      html: emailMessage.resetPasswordMsgSuccess(),
      subject: 'Reset Password',
      text: `Hi ${user.username} your password has been reset`,
      to: user.email,
    })
  }
}
