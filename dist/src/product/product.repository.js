"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editArchiveProduct = exports.deleteImage = exports.findAllImages = exports.findImageById = exports.addNewProductImage = exports.createProductColor = exports.deleteColor = exports.updateColor = exports.createColor = exports.findColorByName = exports.findProductById = exports.findAllProducts = exports.deleteProduct = exports.editProduct = exports.addNewProduct = void 0;
const db_1 = require("../db");
const addNewProduct = (sellerId, body, imageUrl, size) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield db_1.db.product.create({
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
                    };
                }),
            },
            thumbnail: imageUrl,
            seller_id: sellerId,
        },
    });
    return product;
});
exports.addNewProduct = addNewProduct;
const editProduct = (id, body, size) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield db_1.db.product.update({
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
                    };
                }),
            },
        },
    });
    return product;
});
exports.editProduct = editProduct;
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.db.product.update({
        where: {
            id,
        },
        data: {
            is_active: false,
        },
    });
});
exports.deleteProduct = deleteProduct;
const findAllProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield db_1.db.product.findMany({
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
    });
    return products;
});
exports.findAllProducts = findAllProducts;
const findProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield db_1.db.product.findUnique({
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
    });
    return product;
});
exports.findProductById = findProductById;
const findColorByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const color = yield db_1.db.color.findFirst({
        where: {
            color: name,
        },
    });
    return color;
});
exports.findColorByName = findColorByName;
const createColor = (name, productId) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.db.color.create({
        data: {
            color: name,
            product_color: {
                create: {
                    product_id: productId,
                },
            },
        },
    });
});
exports.createColor = createColor;
const updateColor = (id, productId) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.db.color.update({
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
    });
});
exports.updateColor = updateColor;
const deleteColor = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield db_1.db.productColor.deleteMany({
        where: {
            product_id: productId,
        },
    });
    console.log(product);
    return product;
});
exports.deleteColor = deleteColor;
const createProductColor = (colorId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.db.productColor.create({
        data: {
            color_id: colorId,
            product_id: productId,
        },
    });
});
exports.createProductColor = createProductColor;
const addNewProductImage = (productId, imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.db.image_Products.create({
        data: {
            url: imageUrl,
            product_id: productId,
        },
    });
});
exports.addNewProductImage = addNewProductImage;
const findImageById = (imageId) => __awaiter(void 0, void 0, void 0, function* () {
    const imageProduct = yield db_1.db.image_Products.findFirst({
        where: {
            id: imageId,
            product: {
                is_active: true,
            },
        },
    });
    return imageProduct;
});
exports.findImageById = findImageById;
const findAllImages = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const imageProduct = yield db_1.db.image_Products.findMany({
        where: {
            product_id: productId,
            product: {
                is_active: true,
            },
        },
    });
    return imageProduct;
});
exports.findAllImages = findAllImages;
const deleteImage = (imageId) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.db.image_Products.delete({
        where: {
            id: imageId,
        },
    });
});
exports.deleteImage = deleteImage;
const editArchiveProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.db.product.update({
        where: {
            id,
        },
        data: {
            is_archived: true,
        },
    });
});
exports.editArchiveProduct = editArchiveProduct;
