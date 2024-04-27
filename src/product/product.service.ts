import { ProductBody } from '../../types/types'
import ApiError from '../utils/apiError'
import imagekit from '../utils/imagekit'
import * as productRepository from './product.repository'

export const createProduct = async (sellerId: string, body: ProductBody, imageFile: Express.Multer.File) => {
  const uploadFile = await imagekit.upload({
    file: imageFile.buffer,
    fileName: `${imageFile.originalname}-${sellerId}-${Date.now()}`,
    folder: `tenunbuton/${sellerId}/product`,
  })

  const colors = body.colors.split(',')
  const sizes = body.size?.split(',')
  const product = await productRepository.addNewProduct(sellerId, body, uploadFile.url, sizes)

  for (const color of colors) {
    if (color) {
      const checkColor = await productRepository.findColorByName(color)
      if (!checkColor) {
        await productRepository.createColor(color, product.id)
      }
    }
  }
}

export const updateProduct = async (id: string, body: ProductBody) => {
  const product = await getProductById(id)

  const colors = body.colors.split(',')
  const sizes = body.size?.split(',')
  await productRepository.editProduct(id, body, sizes)

  if (colors.length > 0) {
    await productRepository.deleteColor(product.id)
    for (const color of colors) {
      if (color) {
        const checkColor = await productRepository.findColorByName(color)
        if (!checkColor) {
          await productRepository.createColor(color, product.id)
        } else {
          await productRepository.createProductColor(checkColor.id, product.id)
        }
      }
    }
  }
}

export const deleteProduct = async (id: string) => {
  await getProductById(id)
  await productRepository.deleteProduct(id)
}

export const getAllProducts = async () => {
  const products = await productRepository.findAllProducts()
  return products
}

export const getProductById = async (id: string) => {
  const product = await productRepository.findProductById(id)
  if (!product) {
    throw new ApiError('product not found', 404)
  }
  return product
}

export const getAllImages = async (productId: string) => {
  const images = await productRepository.findAllImages(productId)
  return images
}

export const getImageById = async (imageId: string) => {
  const imageProduct = await productRepository.findImageById(imageId)
  if (!imageProduct) {
    throw new ApiError('Image not found', 404)
  }
  return imageProduct
}

export const deleteImageProduct = async (imageId: string) => {
  await getImageById(imageId)
  await productRepository.deleteImage(imageId)
}

export const addNewImage = async (id: string, sellerId: string, imageFile: Express.Multer.File) => {
  const images = await getAllImages(id)
  if (images.length >= 3) {
    throw new ApiError('Max total image is 3', 400)
  }
  const uploadFile = await imagekit.upload({
    file: imageFile.buffer,
    fileName: `${imageFile.originalname}-${sellerId}-${Date.now()}`,
    folder: `tenunbuton/${sellerId}/product`,
  })

  await productRepository.addNewProductImage(id, uploadFile.url)
}

export const archiveProduct = async (id: string) => {
  await productRepository.editArchiveProduct(id)
}
