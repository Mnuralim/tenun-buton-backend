import { ProductBody } from '../../types/types'
import { db } from '../db'

export const addNewProduct = async (sellerId: string, body: ProductBody, imageUrl: string, size: string[]) => {
  const product = await db.product.create({
    data: {
      description: body.description,
      name: body.name,
      price: parseFloat(body.price.toString()),
      condition: body.condition,
      length: parseFloat(body.length.toString()),
      width: parseFloat(body.width.toString()),
      weight: parseFloat(body.weight.toString()),
      category_id: body.category,
      stock: Number(body.stock),
      product_size: {
        create: size.map((s) => {
          return {
            size_id: s,
          }
        }),
      },
      thumbnail: imageUrl,
      seller_id: sellerId,
    },
  })

  return product
}

export const editProduct = async (id: string, body: ProductBody, size: string[]) => {
  const product = await db.product.update({
    where: {
      id,
    },
    data: {
      description: body.description,
      name: body.name,
      price: parseFloat(body.price.toString()),
      condition: body.condition,
      length: parseFloat(body.length.toString()),
      width: parseFloat(body.width.toString()),
      weight: parseFloat(body.weight.toString()),
      category_id: body.category,
      stock: Number(body.stock),
      product_size: {
        deleteMany: {},
        create: size.map((s) => {
          return {
            size_id: s,
          }
        }),
      },
    },
  })
  return product
}

export const deleteProduct = async (id: string) => {
  await db.product.update({
    where: {
      id,
    },
    data: {
      is_active: false,
    },
  })
}

export const findAllProducts = async () => {
  const products = await db.product.findMany({
    include: {
      category: {
        select: {
          name: true,
        },
      },
      product_color: {
        select: {
          color: {
            select: {
              color: true,
            },
          },
        },
      },
      product_size: {
        select: {
          size: {
            select: {
              size: true,
            },
          },
        },
      },
      seller: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          auth: {
            select: {
              email: true,
              username: true,
            },
          },
          address: {
            select: {
              address: true,
              city: true,
              province: true,
              postal_code: true,
              country: true,
              subdistrict: true,
              village: true,
            },
          },
        },
      },
    },
    where: {
      is_active: true,
    },
  })
  return products
}

export const findProductById = async (id: string) => {
  const product = await db.product.findUnique({
    include: {
      category: {
        select: {
          name: true,
        },
      },
      product_color: {
        select: {
          color: {
            select: {
              color: true,
            },
          },
        },
      },
      product_size: {
        select: {
          size: {
            select: {
              size: true,
            },
          },
        },
      },
      seller: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          auth: {
            select: {
              email: true,
              username: true,
            },
          },
          address: {
            select: {
              address: true,
              city: true,
              province: true,
              postal_code: true,
              country: true,
              subdistrict: true,
              village: true,
            },
          },
        },
      },
      images: {
        select: {
          id: true,
          url: true,
        },
      },
    },
    where: {
      is_active: true,
      id,
    },
  })
  return product
}

export const findColorByName = async (name: string) => {
  const color = await db.color.findFirst({
    where: {
      color: name,
    },
  })
  return color
}

export const createColor = async (name: string, productId: string) => {
  await db.color.create({
    data: {
      color: name,
      product_color: {
        create: {
          product_id: productId,
        },
      },
    },
  })
}

export const updateColor = async (id: string, productId: string) => {
  await db.color.update({
    where: {
      id,
    },
    data: {
      product_color: {
        create: {
          product_id: productId,
        },
      },
    },
  })
}

export const deleteColor = async (productId: string) => {
  const product = await db.productColor.deleteMany({
    where: {
      product_id: productId,
    },
  })
  console.log(product)
  return product
}

export const createProductColor = async (colorId: string, productId: string) => {
  await db.productColor.create({
    data: {
      color_id: colorId,
      product_id: productId,
    },
  })
}

export const addNewProductImage = async (productId: string, imageUrl: string) => {
  await db.image_Products.create({
    data: {
      url: imageUrl,
      product_id: productId,
    },
  })
}

export const findImageById = async (imageId: string) => {
  const imageProduct = await db.image_Products.findFirst({
    where: {
      id: imageId,
      product: {
        is_active: true,
      },
    },
  })
  return imageProduct
}

export const findAllImages = async (productId: string) => {
  const imageProduct = await db.image_Products.findMany({
    where: {
      product_id: productId,
      product: {
        is_active: true,
      },
    },
  })

  return imageProduct
}

export const deleteImage = async (imageId: string) => {
  await db.image_Products.delete({
    where: {
      id: imageId,
    },
  })
}

export const editArchiveProduct = async (id: string) => {
  await db.product.update({
    where: {
      id,
    },
    data: {
      is_archived: true,
    },
  })
}
