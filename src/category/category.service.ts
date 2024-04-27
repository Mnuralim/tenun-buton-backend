import { findAllCategories } from './category.repository'

export const getAllCategory = async () => {
  const categories = await findAllCategories()
  return categories
}
