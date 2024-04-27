import crypto from 'crypto'

const generateToken = () => {
  const token = crypto.randomBytes(32).toString('hex')
  const emailVerifToken = crypto.createHash('sha256').update(token).digest('hex')

  return emailVerifToken
}

export default generateToken
