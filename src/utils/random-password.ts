export default function generateRandomString() {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const numberChars = '0123456789'
  const specialChars = '@#$&*'

  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars

  let result = ''

  result += specialChars.charAt(Math.floor(Math.random() * specialChars.length))

  for (let i = 1; i < 8; i++) {
    result += allChars.charAt(Math.floor(Math.random() * allChars.length))
  }

  return result
}
