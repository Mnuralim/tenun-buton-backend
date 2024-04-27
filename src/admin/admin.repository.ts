import { db } from '../db'

export const deleteUserById = async (id: string) => {
  await db.user.update({
    where: {
      id,
    },
    data: {
      is_active: false,
    },
  })
}
