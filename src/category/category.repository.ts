import { db } from '../db'

export const findAllCategories = async () => {
  const categories = await db.category.findMany({
    select: {
      id: true,
      name: true,
      thumbnail: true,
    },
  })
  return categories
}
