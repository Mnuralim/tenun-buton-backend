import { getUserById } from '../user/user.service'
import { deleteUserById } from './admin.repository'

export const removeUser = async (id: string) => {
  await getUserById(id)
  await deleteUserById(id)
}
