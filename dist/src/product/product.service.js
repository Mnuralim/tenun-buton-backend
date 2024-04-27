"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.archiveProduct = exports.addNewImage = exports.deleteImageProduct = exports.getImageById = exports.getAllImages = exports.getProductById = exports.getAllProducts = exports.deleteProduct = exports.updateProduct = exports.createProduct = void 0;
const apiError_1 = __importDefault(require("../utils/apiError"));
const imagekit_1 = __importDefault(require("../utils/imagekit"));
const productRepository = __importStar(require("./product.repository"));
const createProduct = (sellerId, body, imageFile) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uploadFile = yield imagekit_1.default.upload({
        file: imageFile.buffer,
        fileName: `${imageFile.originalname}-${sellerId}-${Date.now()}`,
        folder: `tenunbuton/${sellerId}/product`,
    });
    const colors = body.colors.split(',');
    const sizes = (_a = body.size) === null || _a === void 0 ? void 0 : _a.split(',');
    const product = yield productRepository.addNewProduct(sellerId, body, uploadFile.url, sizes);
    for (const color of colors) {
        if (color) {
            const checkColor = yield productRepository.findColorByName(color);
            if (!checkColor) {
                yield productRepository.createColor(color, product.id);
            }
        }
    }
});
exports.createProduct = createProduct;
const updateProduct = (id, body) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const product = yield (0, exports.getProductById)(id);
    const colors = body.colors.split(',');
    const sizes = (_b = body.size) === null || _b === void 0 ? void 0 : _b.split(',');
    yield productRepository.editProduct(id, body, sizes);
    if (colors.length > 0) {
        yield productRepository.deleteColor(product.id);
        for (const color of colors) {
            if (color) {
                const checkColor = yield productRepository.findColorByName(color);
                if (!checkColor) {
                    yield productRepository.createColor(color, product.id);
                }
                else {
                    yield productRepository.createProductColor(checkColor.id, product.id);
                }
            }
        }
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.getProductById)(id);
    yield productRepository.deleteProduct(id);
});
exports.deleteProduct = deleteProduct;
const getAllProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productRepository.findAllProducts();
    return products;
});
exports.getAllProducts = getAllProducts;
const getProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield productRepository.findProductById(id);
    if (!product) {
        throw new apiError_1.default('product not found', 404);
    }
    return product;
});
exports.getProductById = getProductById;
const getAllImages = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const images = yield productRepository.findAllImages(productId);
    return images;
});
exports.getAllImages = getAllImages;
const getImageById = (imageId) => __awaiter(void 0, void 0, void 0, function* () {
    const imageProduct = yield productRepository.findImageById(imageId);
    if (!imageProduct) {
        throw new apiError_1.default('Image not found', 404);
    }
    return imageProduct;
});
exports.getImageById = getImageById;
const deleteImageProduct = (imageId) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.getImageById)(imageId);
    yield productRepository.deleteImage(imageId);
});
exports.deleteImageProduct = deleteImageProduct;
const addNewImage = (id, sellerId, imageFile) => __awaiter(void 0, void 0, void 0, function* () {
    const images = yield (0, exports.getAllImages)(id);
    if (images.length >= 3) {
        throw new apiError_1.default('Max total image is 3', 400);
    }
    const uploadFile = yield imagekit_1.default.upload({
        file: imageFile.buffer,
        fileName: `${imageFile.originalname}-${sellerId}-${Date.now()}`,
        folder: `tenunbuton/${sellerId}/product`,
    });
    yield productRepository.addNewProductImage(id, uploadFile.url);
});
exports.addNewImage = addNewImage;
const archiveProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield productRepository.editArchiveProduct(id);
});
exports.archiveProduct = archiveProduct;
